param(
    [int]$Port = 8080,
    [string]$Root = $PSScriptRoot
)

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".webp" = "image/webp"
    ".md"   = "text/markdown; charset=utf-8"
}

$routeMap = @{
    "/"                 = "index.html"
    "/index"            = "index.html"
    "/products"         = "products.html"
    "/shop"             = "products.html"
    "/catalog"          = "products.html"
    "/product"          = "product.html"
    "/product-detail"   = "product.html"
    "/cart"             = "cart.html"
    "/checkout"         = "checkout.html"
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Error "Failed to start listener on $prefix : $_"
    exit 1
}

Write-Host "=========================================================="
Write-Host "  APEX Athletic Apparel E-Commerce Store is LIVE!"
Write-Host "  Localhost URL: $prefix"
Write-Host "  Serving files from: $Root"
Write-Host "=========================================================="
Write-Host "Available Routes:"
Write-Host "  Home:           $prefix"
Write-Host "  Products:       $prefix" + "products"
Write-Host "  Product Detail: $prefix" + "product"
Write-Host "  Cart:           $prefix" + "cart"
Write-Host "  Checkout:       $prefix" + "checkout"
Write-Host "=========================================================="
Write-Host "Press Ctrl+C to stop the server."

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.LocalPath
        $relPath = $rawUrl.TrimStart('/')

        # Check route map
        if ($routeMap.ContainsKey($rawUrl)) {
            $relPath = $routeMap[$rawUrl]
        } elseif ([string]::IsNullOrEmpty($relPath)) {
            $relPath = "index.html"
        }

        # Normalize slashes
        $filePath = Join-Path $Root ($relPath -replace '/', '\')

        # If path is a directory, look for index.html or code.html
        if (Test-Path $filePath -PathType Container) {
            $candidate1 = Join-Path $filePath "index.html"
            $candidate2 = Join-Path $filePath "code.html"
            if (Test-Path $candidate1) {
                $filePath = $candidate1
            } elseif (Test-Path $candidate2) {
                $filePath = $candidate2
            }
        }

        # Append .html if extension is omitted
        if (-not (Test-Path $filePath) -and (Test-Path ($filePath + ".html"))) {
            $filePath = $filePath + ".html"
        }

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Cache-Control", "no-cache")

            $output = $response.OutputStream
            $output.Write($bytes, 0, $bytes.Length)
            $output.Close()

            Write-Host "[200] $($request.HttpMethod) $rawUrl -> $relPath"
        } else {
            $msg = "404 Not Found: $rawUrl"
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
            $response.StatusCode = 404
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $output = $response.OutputStream
            $output.Write($bytes, 0, $bytes.Length)
            $output.Close()

            Write-Host "[404] $($request.HttpMethod) $rawUrl"
        }
    } catch {
        # Listener stopped or client disconnected
        if (-not $listener.IsListening) { break }
    }
}

if ($listener.IsListening) {
    $listener.Stop()
}
