param([int]$Port = 5173)
$process = Start-Process "cmd.exe" -ArgumentList "/c", "cd", $pwd.Path, "&& npx vite preview --port $Port" -PassThru -WorkingDirectory $pwd.Path
Start-Sleep 5
Write-Host "Preview server started on port $Port"