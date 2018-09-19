param([bool] $filter = $true, [string] $prefix = "./saucelab"
, [string] $csv = $null)

if($null -eq $csv)
{

    $b = Invoke-RestMethod 'https://saucelabs.com/rest/v1/info/browsers/webdriver'

    #$b | out-file "browserlist.tmp" -encoding ascii;
    $b | export-csv "browserlist.csv"
}
else
{
    $filter = $false;
    $b = import-csv $csv
}

$j = @();

$file = "./browserlist.json";

"" | out-file $file -encoding ascii;

function IsNumeric ($Value) {
    return $Value -match "^[\d\.]+$"
}

function gt($value, [int]$gt)
{
    if(IsNumeric($value))
    {
        return (([int]$value) -gt $gt);
    }

    if($value -match 'dev')
    {
        return $false;
    }

    return $true;
}

function transform($jj, $pre, $post)
{
#$jj | oh

   $v = "{`"base`": `"SauceLabs`", `"browserName`": `"$($jj.api_name)`", `"version`": `"$($jj.short_version)`", `"platform`": `"$($jj.os)`"} ";

   $v | oh

   $u = "$pre `"SL_$($jj.api_name)_$($jj.os.Replace(' ', '_'))_$($jj.short_version)`":$v $post";

   $u | oh

   $u | out-file $file -append -encoding ascii;

}

function filterBrowsers($b)
{
    $j = @();


    $k = $b | ? {$_.long_name -match 'Firefox' -and (gt $_.short_version  43)}

    $k | foreach {$j += $_};

    $k = $b | ? {$_.long_name -match 'Chrome' -and (gt $_.short_version  48)}

    $k | foreach {$j += $_};

    $k = $b | ? {$_.long_name -match 'android' -and (gt $_.short_version  6)}

    $k | foreach {$j += $_};

    #$k = $b | ? {$_.long_name -match 'Safari' -and $_.os -match 'Mac'}

    $k = $b | ? {-Not ($_.long_name -match '((Chrome)|(Firefox)|(android))')}


    $k | foreach {$j += $_};

    return $j;
}

$j = @();
if($filter)
{
    $j = filterBrowsers $b;
}
else {
    $b | foreach {$j += $_};
}

"JJ: $($j.length)" | oh

transform $j[0] "{" ""
$j[1..($j.length - 2)] | foreach { transform $_  ", " ""}
transform $j[$j.length - 1] ", " " } "


$j = ConvertFrom-Json (gc $file | out-string)
$props = $j | get-member | ? {$_.MemberType -eq 'NoteProperty'}

$max = 3;
$l = $props.length;
[int] $jump = $l / $max;

$idx = 0;
$nodup = @{};

for($i = 0; $i -lt ($max + 1); $i++)
{
    $ff = "$prefix-$i.ps1"

    $ps1 = @"
    function do_test(`$envvar, `$progress){
        `$env:SAUCE_SELENIUM_BROWSER="`$envvar";
        #`$res = node .\index.js;
        `$proc = Start-Process -WindowStyle hidden -filePath 'node.exe' -ArgumentList './index.js' -RedirectStandardOutput stdout.txt -RedirectStandardError stderr.txt -PassThru
        `$proc | Wait-Process -Timeout 600 -ErrorAction 0 -ErrorVariable timeouted
        #if(0 -ne `$LASTEXITCODE)

        `$F = 'FAILED';

        if(`$timeouted)
        {
            # terminate the process
            `$proc | kill
            `$F="TIMEOUT";
        }

        `$res = gc stdout.txt
        `$res += gc stderr.txt
 
        if(`$timeouted -or 0 -ne `$proc.ExitCode)
        {
            `"`$res`" | out-file 'selenium.txt' -append
            "`$progress``t`$env:SAUCE_SELENIUM_BROWSER``t`$F`" | out-host
        }else
        {
            "`$progress``t`$env:SAUCE_SELENIUM_BROWSER``tSUCCESSED`" | out-host
        }
    }
"@

    "$ps1" | out-file $ff -encoding ascii;

    $v = 0;

    for($h = ($i * $jump); $h -lt (($i + 1)* $jump); $h++)
    {
        $v++;

        [int] $perc = $v / $jump * 100;

        $progress = "$v of $jump [$perc%]";

        if($idx -gt ($l - 1))
        {
            break;
        }

        $name = "$($props[$idx++].name)";
        $p = $j."$Name"
        
        "outputing $($idx - 1) - $h  $name" | Out-Host

        $envvar = "$($p.browserName):$($p.version):$($p.platform)";

        if($nodup.ContainsKey($envvar))
        {
            continue;
        }

        $nodup.Add($envvar, $envvar);

        #"`$env:SAUCE_SELENIUM_BROWSER=`"$($p.browserName):$($p.version):$($p.platform)`";`r`n`$res = node .\index.js;if(0 -ne `$LASTEXITCODE){`"`$res`" | out-file 'selenium.txt' -append}`r`n" | out-file $ff -append -encoding ascii;
        
        $ps1 = "do_test `"$envvar`" `"$progress`";`n"
        
        $ps1 | out-file $ff -append -encoding ascii;
    }
}

#$props | foreach{$p=$j."$($_.Name)";$exec+="`$env:SAUCE_SELENIUM_BROWSER=`"$($p.browserName):$($p.version):$($p.platform)`";node .\index.js`r`n"}



