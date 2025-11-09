# PowerShell script to clean up unnecessary files from the project
# Run with: powershell -ExecutionPolicy Bypass -File scripts/cleanup-project.ps1

$projectRoot = "c:\Users\jaipr\Desktop\Group26\mindcourse"

Write-Host "🧹 Starting project cleanup..." -ForegroundColor Cyan

# Directories to remove
$dirsToRemove = @(
    # Test pages
    "app\test-course-builder",
    "app\test-course-generation",
    "app\test-integrated-quiz",
    "app\test-quiz",
    "app\test-quiz-debug",
    "app\test-quiz-flow",
    "app\test-structured-quiz",
    "app\test-youtube",
    "app\test-youtube-simple",
    
    # Duplicate/unused generators
    "app\ai-course-generator",
    "app\enhanced-course-generator",
    
    # Debug/migration pages
    "app\debug-youtube",
    "app\migrate-schema",
    
    # Example pages (if you don't need them)
    "app\examples",
    
    # Explore page (if unused)
    "app\explore"
)

$removedCount = 0

foreach ($dir in $dirsToRemove) {
    $fullPath = Join-Path $projectRoot $dir
    if (Test-Path $fullPath) {
        try {
            Remove-Item -Path $fullPath -Recurse -Force
            Write-Host "✅ Removed: $dir" -ForegroundColor Green
            $removedCount++
        } catch {
            Write-Host "❌ Failed to remove: $dir - $_" -ForegroundColor Red
        }
    } else {
        Write-Host "⏭️  Skipped (not found): $dir" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Cleanup complete! Removed $removedCount directories" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 Remaining important directories:" -ForegroundColor Cyan
Write-Host "  - app/dashboard (main user interface)" -ForegroundColor White
Write-Host "  - app/create-course (course creation)" -ForegroundColor White  
Write-Host "  - app/course (course viewing)" -ForegroundColor White
Write-Host "  - app/api (all API endpoints)" -ForegroundColor White
Write-Host ""
Write-Host "💡 Your project is now cleaner and more organized!" -ForegroundColor Green
