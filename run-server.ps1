$proc = Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd backend; npm run dev" -NoNewWindow -PassThru
Start-Sleep -Seconds 5
$body = @{name="Test User";phone="01512345678";email="test@example.com";subject="Test Subject";message="Test message"} | ConvertTo-Json
try {
    $resp = Invoke-RestMethod -Uri "http://localhost:3001/api/contact" -Method Post -Body $body -ContentType "application/json"
    $resp
} catch {
    Write-Host "Error:" $_.Exception.Message
}
Stop-Process $proc.Id -Force -ErrorAction SilentlyContinue