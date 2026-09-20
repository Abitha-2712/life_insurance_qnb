#Requires -Version 5.1
<#
.SYNOPSIS
  SoftFetch base+path fixes: align React createCrudService with Flutter datasources.
.NOTES
  Run on MANTIS Windows. Uses UTF8Encoding($false) for writes.
  Does NOT change UI icons, logout, or createCrudService no-mock policy.
#>
$ErrorActionPreference = 'Stop'
$ReactRoot = 'D:\react_new'
$FlutterLib = 'E:\qnb_life\qnb-insurance-ui\lib'
$SummaryPath = Join-Path $ReactRoot 'SOFTFETCH_BASE_FIXES.md'
$Utf8NoBom = New-Object System.Text.UTF8Encoding $false

function Write-Utf8NoBom([string]$Path, [string]$Content) {
  [System.IO.File]::WriteAllText($Path, $Content, $Utf8NoBom)
}

if (-not (Test-Path $ReactRoot)) { throw "React root missing: $ReactRoot" }
if (-not (Test-Path $FlutterLib)) { throw "Flutter lib missing: $FlutterLib" }

Write-Host "Scanning Flutter datasources for baseUrlOverride..."

# Map: relative feature-ish key -> @{ Host='data'|'wfc'|'bo'; Paths=@{fetchAll=..;create=..;update=..;delete=..}; Source=file }
$flutterMap = @{}

$datasourceFiles = Get-ChildItem -Path $FlutterLib -Recurse -Filter '*datasource*.dart' -File -ErrorAction SilentlyContinue
$urlFiles = Get-ChildItem -Path (Join-Path $FlutterLib 'network\url') -Recurse -Filter '*.dart' -File -ErrorAction SilentlyContinue

# Parse URL dart files: static const String name = 'path';
$urlConsts = @{} # fileBase -> @{ constName -> path }
foreach ($uf in $urlFiles) {
  $txt = Get-Content -LiteralPath $uf.FullName -Raw -ErrorAction SilentlyContinue
  if (-not $txt) { continue }
  $bag = @{}
  foreach ($m in [regex]::Matches($txt, "static\s+const\s+String\s+(\w+)\s*=\s*['\`"]([^'\`"]+)['\`"]")) {
    $bag[$m.Groups[1].Value] = $m.Groups[2].Value
  }
  # also non-static const patterns
  foreach ($m in [regex]::Matches($txt, "const\s+String\s+(\w+)\s*=\s*['\`"]([^'\`"]+)['\`"]")) {
    if (-not $bag.ContainsKey($m.Groups[1].Value)) { $bag[$m.Groups[1].Value] = $m.Groups[2].Value }
  }
  $urlConsts[$uf.BaseName] = $bag
  $urlConsts[$uf.Name] = $bag
}

function Resolve-HostFromText([string]$txt) {
  if ($txt -match 'baseUrlOverride\s*:\s*dataurl') { return 'data' }
  if ($txt -match 'baseUrlOverride\s*:\s*wfc') { return 'wfc' }
  if ($txt -match 'baseUrlOverride\s*:\s*baseUrl') { return 'bo' }
  # customDio() without override => default BO
  if ($txt -match 'customDio\s*\(') { return 'bo' }
  return $null
}

function Guess-KeysFromDatasource([string]$path, [string]$txt) {
  # Derive logical keys from path: features/CMS/card_spend/... -> card_spend, cardspend, card-spend
  $norm = $path.Replace('\','/')
  $keys = New-Object System.Collections.Generic.List[string]
  if ($norm -match '/features/([^/]+)/') { [void]$keys.Add($Matches[1]) }
  if ($norm -match '/features/CMS/([^/]+)/') { [void]$keys.Add($Matches[1]); [void]$keys.Add('CMS/'+$Matches[1]) }
  if ($norm -match '/features/other_config/([^/]+)/') { [void]$keys.Add($Matches[1]) }
  if ($norm -match '/features/master/([^/]+)/') { [void]$keys.Add($Matches[1]); [void]$keys.Add('master/'+$Matches[1]) }
  if ($norm -match '/features/workflow_new/([^/]+)/') { [void]$keys.Add($Matches[1]) }
  # filename stem
  $bn = [IO.Path]::GetFileNameWithoutExtension($path) -replace '_datasource$','' -replace '_data_source$',''
  [void]$keys.Add($bn)
  return ($keys | Select-Object -Unique)
}

function Extract-PathsFromDatasource([string]$txt, [hashtable]$urlConsts) {
  $paths = @{ fetchAll = $null; create = $null; update = $null; delete = $null }
  # Direct string posts
  $posts = [regex]::Matches($txt, "dio\.post\(\s*['\`"]([^'\`"]+)['\`"]")
  $allPosts = @($posts | ForEach-Object { $_.Groups[1].Value })
  # Url class refs: SomeUrl.fetchAll / getAll / manage / create
  $refs = [regex]::Matches($txt, "(\w+Url)\.(\w+)")
  $resolved = @()
  foreach ($r in $refs) {
    $cls = $r.Groups[1].Value
    $mem = $r.Groups[2].Value
    # find matching url file bag by fuzzy class name
    $bag = $null
    foreach ($k in $urlConsts.Keys) {
      $kn = ($k -replace '_url$','' -replace '\.dart$','' -replace '_','')
      $cn = ($cls -replace 'Url$','' -replace '_','')
      if ($kn -and $cn -and ($kn -ieq $cn -or $k -match [regex]::Escape(($cls -replace 'Url$','' -creplace '([a-z])([A-Z])','$1_$2').ToLower()))) {
        $bag = $urlConsts[$k]; break
      }
    }
    # also try camel to snake file names
    if (-not $bag) {
      $snake = ($cls -replace 'Url$','' -creplace '([a-z])([A-Z])','$1_$2').ToLower() + '_url'
      if ($urlConsts.ContainsKey($snake)) { $bag = $urlConsts[$snake] }
      elseif ($urlConsts.ContainsKey($snake + '.dart')) { $bag = $urlConsts[$snake + '.dart'] }
    }
    if ($bag -and $bag.ContainsKey($mem)) { $resolved += [pscustomobject]@{ Member=$mem; Path=$bag[$mem] } }
  }
  # Heuristic assignment
  foreach ($item in $resolved) {
    $m = $item.Member.ToLower()
    $p = $item.Path
    if ($m -match 'fetchall|getall|list|summary|getsegment') {
      if (-not $paths.fetchAll) { $paths.fetchAll = $p }
    } elseif ($m -match 'manage') {
      if (-not $paths.create) { $paths.create = $p }
      if (-not $paths.update) { $paths.update = $p }
      if (-not $paths.delete) { $paths.delete = $p }
    } elseif ($m -match 'create|save|add|post|modify') {
      if ($m -match 'update|edit') { if (-not $paths.update) { $paths.update = $p } }
      elseif ($m -match 'delete|remove') { if (-not $paths.delete) { $paths.delete = $p } }
      else {
        if (-not $paths.create) { $paths.create = $p }
        if ($m -match 'modify|save') { if (-not $paths.update) { $paths.update = $p } }
      }
    } elseif ($m -match 'update|edit') {
      if (-not $paths.update) { $paths.update = $p }
    } elseif ($m -match 'delete|remove') {
      if (-not $paths.delete) { $paths.delete = $p }
    }
  }
  # fallback: first post string as fetchAll if still empty
  if (-not $paths.fetchAll -and $allPosts.Count -gt 0) { $paths.fetchAll = $allPosts[0] }
  return $paths
}

$dsHostHits = 0
foreach ($df in $datasourceFiles) {
  $txt = Get-Content -LiteralPath $df.FullName -Raw -ErrorAction SilentlyContinue
  if (-not $txt) { continue }
  $hostName = Resolve-HostFromText $txt
  if (-not $hostName) { continue }
  $dsHostHits++
  $keys = Guess-KeysFromDatasource $df.FullName $txt
  $paths = Extract-PathsFromDatasource $txt $urlConsts
  foreach ($k in $keys) {
    $nk = ($k -replace '_management$','' -replace '_config$','' -replace '_configuration$','').ToLower()
    $entry = @{
      Host = $hostName
      Paths = $paths
      Source = $df.FullName
      Key = $k
    }
    $flutterMap[$nk] = $entry
    $flutterMap[$k.ToLower()] = $entry
  }
}

Write-Host ("Flutter datasources with host signal: {0}; map keys: {1}" -f $dsHostHits, $flutterMap.Count)

# Also scan ALL dart under features for baseUrlOverride even outside *datasource* name
$extra = Get-ChildItem -Path (Join-Path $FlutterLib 'features') -Recurse -Filter '*.dart' -File -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -match '\\data\\' -and $_.Name -notmatch 'freezed|\.g\.dart' }
foreach ($df in $extra) {
  $txt = Get-Content -LiteralPath $df.FullName -Raw -ErrorAction SilentlyContinue
  if (-not $txt) { continue }
  if ($txt -notmatch 'baseUrlOverride') { continue }
  $hostName = Resolve-HostFromText $txt
  if (-not $hostName) { continue }
  $keys = Guess-KeysFromDatasource $df.FullName $txt
  $paths = Extract-PathsFromDatasource $txt $urlConsts
  foreach ($k in $keys) {
    $nk = $k.ToLower()
    if (-not $flutterMap.ContainsKey($nk)) {
      $flutterMap[$nk] = @{ Host=$hostName; Paths=$paths; Source=$df.FullName; Key=$k }
    } elseif ($hostName -eq 'data' -or $hostName -eq 'wfc') {
      # prefer data/wfc over bo if we find stronger signal
      $flutterMap[$nk].Host = $hostName
      if ($paths.fetchAll) { $flutterMap[$nk].Paths = $paths }
      $flutterMap[$nk].Source = $df.FullName
    }
  }
}

# Priority React service name aliases -> flutter map keys
$aliases = @{
  'card_spend' = @('card_spend','cardspend')
  'stories' = @('stories','stories_management','storiesmanagement')
  'google_pay' = @('google_pay','googlepay')
  'apple_pay' = @('apple_pay','applepay','apple')
  'segment_access_management' = @('segment_access_management','customer_segment','customersegment','segment')
  'FAQ_management' = @('faq_management','faq')
  'bank_management' = @('bank_management','bank')
  'force_update_configuration' = @('force_update_configuration','force_update','forceupdate')
  'about_QNB' = @('about_qnb','about')
  'atmLocator' = @('atm_locator','atm')
  'branchLocator' = @('branch_locator','branch')
  'kioskLocator' = @('kiosk_locator','kiosk')
  'dc_city_master' = @('dc_city_master','dccitymaster','city_master')
  'employment_masters' = @('employment_masters','employment_master','employment_master_city','employment')
  'android_config' = @('android_config','android')
}

function Find-FlutterEntry([string]$serviceName) {
  $cands = @($serviceName.ToLower())
  $cands += ($serviceName -replace 'Service$','').ToLower()
  $stem = ($serviceName -replace 'Service$','' -replace '_Service$','').ToLower()
  $cands += $stem
  if ($aliases.ContainsKey($stem)) { $cands += $aliases[$stem] }
  # strip common suffixes
  $cands += ($stem -replace '_management$','' -replace '_configuration$','' -replace '_config$','')
  foreach ($c in ($cands | Select-Object -Unique)) {
    if ($flutterMap.ContainsKey($c)) { return $flutterMap[$c] }
  }
  # fuzzy contains
  foreach ($k in $flutterMap.Keys) {
    if ($k -and $stem -and ($k -like "*$stem*" -or $stem -like "*$k*")) { return $flutterMap[$k] }
  }
  return $null
}

function Ensure-BaseInCrud([string]$text, [string]$base) {
  # Insert base: 'data' into createCrudService({ ... }) if missing or wrong
  if ($text -match "base:\s*['\`"]$base['\`"]") { return @{ Text=$text; Changed=$false } }
  if ($text -match "base:\s*['\`"]\w+['\`"]") {
    $new = [regex]::Replace($text, "base:\s*['\`"]\w+['\`"]", "base: '$base'", 1)
    return @{ Text=$new; Changed=($new -ne $text) }
  }
  # insert after name: '...' line or after createCrudService({
  if ($text -match "(createCrudService\(\{\s*\r?\n(\s*)name:\s*['\`"][^'\`"]+['\`"],)") {
    $indent = $Matches[2]
    $new = $text -replace "(createCrudService\(\{\s*\r?\n\s*name:\s*['\`"][^'\`"]+['\`"],)", "`$1`r`n$indent`base: '$base',"
    return @{ Text=$new; Changed=($new -ne $text) }
  }
  $new = [regex]::Replace($text, 'createCrudService\(\{', "createCrudService({`r`n  base: '$base',", 1)
  return @{ Text=$new; Changed=($new -ne $text) }
}

function Patch-Urls([string]$text, [hashtable]$paths) {
  $changed = $false
  $new = $text
  if ($paths.fetchAll) {
    # quoted fetchAll value
    $n2 = [regex]::Replace($new, "(['\`"]fetchAll['\`"]\s*:\s*)['\`"][^'\`"]+['\`"]", "`$1'$($paths.fetchAll)'", 1)
    if ($n2 -eq $new) {
      $n2 = [regex]::Replace($new, "(fetchAll\s*:\s*)['\`"][^'\`"]+['\`"]", "`$1'$($paths.fetchAll)'", 1)
    }
    # property refs like fooUrls.bar — skip if already URL module (leave unless inferred string)
    if ($n2 -ne $new) { $new = $n2; $changed = $true }
  }
  foreach ($op in @('create','update','delete')) {
    if (-not $paths[$op]) { continue }
    $n2 = [regex]::Replace($new, "(['\`"]$op['\`"]\s*:\s*)['\`"][^'\`"]+['\`"]", "`$1'$($paths[$op])'", 1)
    if ($n2 -eq $new) {
      $n2 = [regex]::Replace($new, "($op\s*:\s*)['\`"][^'\`"]+['\`"]", "`$1'$($paths[$op])'", 1)
    }
    if ($n2 -ne $new) { $new = $n2; $changed = $true }
  }
  # strip inferred comment honesty when we fixed
  if ($changed -or $true) {
    $n3 = $new -replace '/\*\*[^*]*inferred BO paths[^*]*\*/\r?\n', ''
    $n3 = $n3 -replace '//[^\n]*inferred BO paths[^\n]*\r?\n', ''
    if ($n3 -ne $new) { $new = $n3; $changed = $true }
  }
  return @{ Text=$new; Changed=$changed }
}

# Priority order
$priorityNames = @(
  'card_spend','stories','google_pay','apple_pay','segment_access_management',
  'FAQ_management','bank_management','force_update_configuration','about_QNB',
  'atmLocator','branchLocator','kioskLocator','dc_city_master','employment_masters'
)

$serviceFiles = Get-ChildItem -Path (Join-Path $ReactRoot 'src\features') -Recurse -Filter '*Service.js' -File |
  Where-Object { $_.FullName -notmatch '\\__tests__\\' }

$changes = New-Object System.Collections.Generic.List[object]
$fixed = 0
$remaining = New-Object System.Collections.Generic.List[string]
$skippedBo = 0
$noFlutter = 0

function Get-PriorityRank([string]$name) {
  $stem = ($name -replace 'Service\.js$','').ToLower()
  $i = 0
  foreach ($p in $priorityNames) {
    if ($stem -eq $p.ToLower() -or $stem -like "*$($p.ToLower())*") { return $i }
    $i++
  }
  return 1000
}

$ordered = $serviceFiles | Sort-Object { Get-PriorityRank $_.Name }, FullName

foreach ($sf in $ordered) {
  $text = Get-Content -LiteralPath $sf.FullName -Raw
  if ($text -notmatch 'createCrudService') { continue }
  $hasData = $text -match "base:\s*['\`"]data['\`"]"
  $hasWfc = $text -match "base:\s*['\`"]wfc['\`"]"
  $inferred = $text -match '(?i)inferred'
  if (($hasData -or $hasWfc) -and -not $inferred) { continue }

  $stem = $sf.BaseName -replace 'Service$',''
  $entry = Find-FlutterEntry $stem
  if (-not $entry) {
    # try parent folder name
    $parent = $sf.Directory.Parent.Name
    if ($parent -eq 'services') { $parent = $sf.Directory.Parent.Parent.Name }
    $entry = Find-FlutterEntry $parent
  }

  if (-not $entry) {
    $noFlutter++
    if ($inferred -or -not ($hasData -or $hasWfc)) {
      [void]$remaining.Add(("$($sf.FullName) | no Flutter host match (still default bo/inferred)"))
    }
    continue
  }

  $hostName = $entry.Host
  if ($hostName -eq 'bo') {
    $skippedBo++
    # Still fix paths if inferred and we have better Flutter paths
    if ($inferred -and $entry.Paths -and $entry.Paths.fetchAll) {
      $pr = Patch-Urls $text $entry.Paths
      if ($pr.Changed) {
        # keep base bo (default) — just fix paths + remove inferred comment
        $newText = $pr.Text
        # ensure we don't leave empty issues
        if ($newText -ne $text) {
          Write-Utf8NoBom $sf.FullName $newText
          $fixed++
          [void]$changes.Add([pscustomobject]@{
            File = $sf.FullName
            Base = 'bo (paths only)'
            FetchAll = $entry.Paths.fetchAll
            Flutter = $entry.Source
            Note = 'path fix; host remains bo'
          })
          $text = $newText
        }
      }
    }
    continue
  }

  # data or wfc
  $br = Ensure-BaseInCrud $text $hostName
  $newText = $br.Text
  $pathChanged = $false
  if ($entry.Paths) {
    $pr = Patch-Urls $newText $entry.Paths
    $newText = $pr.Text
    $pathChanged = $pr.Changed
  }
  # Special: segment getSegmentList
  if ($stem -match 'segment' -and $entry.Paths.fetchAll) {
    # already handled
  }
  # Special: dc_city manage pattern
  if ($stem -match 'dc_city' -and $entry.Paths.create) {
    # ok
  }

  if ($newText -ne $text) {
    Write-Utf8NoBom $sf.FullName $newText
    $fixed++
    [void]$changes.Add([pscustomobject]@{
      File = $sf.FullName
      Base = $hostName
      FetchAll = $(if ($entry.Paths) { $entry.Paths.fetchAll } else { '(unchanged)' })
      Create = $(if ($entry.Paths) { $entry.Paths.create } else { '' })
      Flutter = $entry.Source
      Note = 'base+path aligned to Flutter'
    })
  } else {
    [void]$remaining.Add(("$($sf.FullName) | Flutter host=$hostName but no text change"))
  }
}

# Explicit getSegmentList sanity: ensure path is customerSeg/getSegmentList
$seg = Join-Path $ReactRoot 'src\features\segment_access_management\services\segment_access_managementService.js'
if (Test-Path $seg) {
  $st = Get-Content -LiteralPath $seg -Raw
  $segEntry = Find-FlutterEntry 'segment_access_management'
  $want = 'customerSeg/getSegmentList'
  if ($segEntry -and $segEntry.Paths.fetchAll) { $want = $segEntry.Paths.fetchAll }
  if ($st -notmatch [regex]::Escape($want)) {
    # If using urls module, patch the urls file instead
    $urlsFile = Join-Path $ReactRoot 'src\core\api\urls\customer_segmentUrls.js'
    if (Test-Path $urlsFile) {
      $ut = Get-Content -LiteralPath $urlsFile -Raw
      $ut2 = $ut -replace "getCustomerSegmentList:\s*['\`"][^'\`"]+['\`"]", "getCustomerSegmentList: '$want'"
      $ut2 = $ut2 -replace "getAllSegmentData:\s*['\`"][^'\`"]+['\`"]", "getAllSegmentData: '$want'"
      if ($ut2 -ne $ut) {
        Write-Utf8NoBom $urlsFile $ut2
        [void]$changes.Add([pscustomobject]@{
          File=$urlsFile; Base='(urls)'; FetchAll=$want; Create=''; Flutter=$(if($segEntry){$segEntry.Source}else{'CSV/fallback'}); Note='getSegmentList 404 path fix'
        })
        $fixed++
      }
    }
  }
  # If Flutter says data host for segment, set base
  if ($segEntry -and ($segEntry.Host -eq 'data' -or $segEntry.Host -eq 'wfc')) {
    $br = Ensure-BaseInCrud $st $segEntry.Host
    if ($br.Changed) {
      Write-Utf8NoBom $seg $br.Text
      [void]$changes.Add([pscustomobject]@{
        File=$seg; Base=$segEntry.Host; FetchAll=$want; Create=''; Flutter=$segEntry.Source; Note='segment base fix'
      })
      $fixed++
    }
  }
}

# High-confidence sample fallbacks if Flutter scan missed but samples known
$known = @(
  @{ Rel='src\features\dc_city_master\services\dc_city_masterService.js'; Base='data'; Paths=@{ fetchAll='city-master/getAll'; create='city-master/manage'; update='city-master/manage'; delete='city-master/manage' }; Why='Flutter sample dc_city_master_datasource dataurl + city-master/manage' }
)

foreach ($k in $known) {
  $fp = Join-Path $ReactRoot $k.Rel
  if (-not (Test-Path $fp)) { continue }
  $already = $changes | Where-Object { $_.File -eq $fp }
  if ($already) { continue }
  $t = Get-Content -LiteralPath $fp -Raw
  if ($t -match "base:\s*['\`"]data['\`"]") { continue }
  $br = Ensure-BaseInCrud $t $k.Base
  $pr = Patch-Urls $br.Text $k.Paths
  if ($pr.Text -ne $t) {
    Write-Utf8NoBom $fp $pr.Text
    $fixed++
    [void]$changes.Add([pscustomobject]@{
      File=$fp; Base=$k.Base; FetchAll=$k.Paths.fetchAll; Create=$k.Paths.create; Flutter=$k.Why; Note='known sample fallback'
    })
  }
}

# Recompute remaining inferred / missing data|wfc after patches
$remainList = New-Object System.Collections.Generic.List[string]
Get-ChildItem -Path (Join-Path $ReactRoot 'src\features') -Recurse -Filter '*Service.js' -File |
  Where-Object { $_.FullName -notmatch '\\__tests__\\' } | ForEach-Object {
    $t = Get-Content -LiteralPath $_.FullName -Raw
    if ($t -notmatch 'createCrudService') { return }
    $hasData = $t -match "base:\s*['\`"]data['\`"]"
    $hasWfc = $t -match "base:\s*['\`"]wfc['\`"]"
    $inferred = $t -match '(?i)inferred'
    if ((-not $hasData -and -not $hasWfc) -or $inferred) {
      $hostHint = 'unknown'
      $e = Find-FlutterEntry ($_.BaseName -replace 'Service$','')
      if ($e) { $hostHint = $e.Host }
      [void]$remainList.Add( ("{0} | flutterHost={1} inferred={2}" -f $_.FullName, $hostHint, $inferred) )
    }
  }

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('# SoftFetch base+path fixes')
[void]$sb.AppendLine('')
[void]$sb.AppendLine(("_Generated: {0} IST_" -f (Get-Date -Format 'yyyy-MM-dd HH:mm')))
[void]$sb.AppendLine(('_Machine: MANTIS `44e5b519-06cb-4a7b-ba2a-ea4604831770`_'))
[void]$sb.AppendLine('')
[void]$sb.AppendLine('## Method')
[void]$sb.AppendLine('1. Scan Flutter `lib/**/*datasource*.dart` (+ `features/**/data/**/*.dart`) for `baseUrlOverride: dataurl|wfc|baseUrl`.')
[void]$sb.AppendLine('2. Resolve URL paths from `lib/network/url/**/*.dart` constants referenced by datasources.')
[void]$sb.AppendLine('3. Patch React `createCrudService` SoftFetch services: set `base` + string urls when Flutter host is data/wfc (or path-only when inferred BO).')
[void]$sb.AppendLine('4. Special-case `getSegmentList` path; priority CMS/home modules first.')
[void]$sb.AppendLine('5. Writes use `UTF8Encoding($false)` (no BOM).')
[void]$sb.AppendLine('')
[void]$sb.AppendLine('## Counts')
[void]$sb.AppendLine('')
[void]$sb.AppendLine('| Metric | Value |')
[void]$sb.AppendLine('|---|---|')
[void]$sb.AppendLine(("| Fixed (files written) | **{0}** |" -f $fixed))
[void]$sb.AppendLine(("| Remaining SoftFetch lacking base data/wfc or still inferred | **{0}** |" -f $remainList.Count))
[void]$sb.AppendLine(("| Flutter datasource host signals | {0} |" -f $dsHostHits))
[void]$sb.AppendLine(("| Map keys | {0} |" -f $flutterMap.Count))
[void]$sb.AppendLine(("| Skipped (Flutter host=bo) | {0} |" -f $skippedBo))
[void]$sb.AppendLine('')
[void]$sb.AppendLine('## Changes')
[void]$sb.AppendLine('')
if ($changes.Count -eq 0) {
  [void]$sb.AppendLine('_No files changed._')
} else {
  [void]$sb.AppendLine('| File | base | fetchAll | create/manage | Flutter source | Note |')
  [void]$sb.AppendLine('|---|---|---|---|---|---|')
  foreach ($c in $changes) {
    $rel = $c.File.Replace($ReactRoot + '\','').Replace($ReactRoot+'/','')
    $fl = if ($c.Flutter) { $c.Flutter.Replace($FlutterLib + '\','lib\').Replace($FlutterLib+'/','lib/') } else { '' }
    [void]$sb.AppendLine(("| `{0}` | `{1}` | `{2}` | `{3}` | `{4}` | {5} |" -f $rel, $c.Base, $c.FetchAll, $c.Create, $fl, $c.Note))
  }
}
[void]$sb.AppendLine('')
[void]$sb.AppendLine('## Remaining')
[void]$sb.AppendLine('')
foreach ($r in ($remainList | Select-Object -First 200)) {
  [void]$sb.AppendLine(("- $r"))
}
if ($remainList.Count -gt 200) {
  [void]$sb.AppendLine(("- ... and {0} more" -f ($remainList.Count - 200)))
}
[void]$sb.AppendLine('')
[void]$sb.AppendLine('## Files changed (list)')
[void]$sb.AppendLine('')
foreach ($c in $changes) {
  [void]$sb.AppendLine(("- $($c.File)"))
}

Write-Utf8NoBom $SummaryPath ($sb.ToString())
Write-Host "DONE fixed=$fixed remaining=$($remainList.Count) summary=$SummaryPath"
$changes | ForEach-Object { Write-Host ("CHANGED: {0} base={1} fetchAll={2}" -f $_.File, $_.Base, $_.FetchAll) }
