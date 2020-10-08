function ConvertFrom-Json20([object] $item){ 
    add-type -assembly system.web.extensions
    $ps_js=new-object system.web.script.serialization.javascriptSerializer

    #The comma operator is the array construction operator in PowerShell
    return ,$ps_js.DeserializeObject($item)
}
'Date,Download,Upload,Retrans,Server,Error' | out-file -encoding utf8 .\mlab\ndt7-client.csv
select-string -path .\mlab\ndt7-client.log -pattern '([^{]*)(\{.*\})'  | foreach {
  $json=$_.Matches[0].Groups[2].Value
  $dtstamp=$_.Matches[0].Groups[1].Value
  $o=convertfrom-json20 $json
  if ($_.Matches[0].Groups[1].Length -gt 0) {
	  if ($o.keys -contains "Download") {
		"$dtstamp,$($o.Download.Value),$($o.Upload.Value),$($o.DownloadRetrans.Value),""$($o.ServerFQDN)"""
	  } else {
	    "$dtstamp,,,,,""$($o.Value.Test  -replace '""','""""') $($o.Value.Failure  -replace '""','""""')"""
	  }
  }
} | out-file -Append -Encoding utf8 -FilePath .\mlab\ndt7-client.csv