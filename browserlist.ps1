

$b = Invoke-RestMethod 'https://saucelabs.com/rest/v1/info/browsers/webdriver'
$j = @();

$file = "./browserlist.json";

"" | out-file $file -encoding ascii;



function transform($jj, $pre, $post)
{
#$jj | oh

    $v = "{`"base`": `"SauceLabs`", `"browserName`": `"$($jj.api_name)`", `"version`": `"$($jj.short_version)`", `"platform`": `"$($jj.os)`"} ";

   $v | oh

   $u = "$pre `"SL_$($jj.api_name)_$($jj.os.Replace(' ', '_'))_$($jj.short_version)`":$v $post";

   $u | oh

   $u | out-file $file -append -encoding ascii;


}

$k = $b | ? {$_.long_name -match 'Firefox' -and $_.os -match 'Windows 10' -and ([int]$_.short_version) -gt 43}

$k | foreach {$j += $_};

$k = $b | ? {$_.long_name -match 'Chrome' -and $_.os -match 'Windows 10' -and ([int]$_.short_version) -gt 46}

$k | foreach {$j += $_};

$k = $b | ? {$_.long_name -match 'Safari' -and $_.os -match 'Mac'}

$j = @();

$k | foreach {$j += $_};

"JJ: $($j.length)" | oh

transform $j[0] "{" ""
$j[1..($j.length - 2)] | foreach { transform $_  ", " ""}
transform $j[$j.length - 1] ", " " } "



