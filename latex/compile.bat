@echo off
echo ============================================================
echo  Screen.AI — LaTeX Compile Script
echo ============================================================

echo.
echo [1/4] Compiling Track A (Research Paper)...
pdflatex -interaction=nonstopmode milestone3_trackA.tex
bibtex milestone3_trackA
pdflatex -interaction=nonstopmode milestone3_trackA.tex
pdflatex -interaction=nonstopmode milestone3_trackA.tex

echo.
echo [2/4] Compiling Track B (System Documentation)...
pdflatex -interaction=nonstopmode milestone3_trackB.tex
bibtex milestone3_trackB
pdflatex -interaction=nonstopmode milestone3_trackB.tex
pdflatex -interaction=nonstopmode milestone3_trackB.tex

echo.
echo [3/4] Cleaning auxiliary files...
del /q *.aux *.log *.toc *.out *.bbl *.blg *.lof *.lot 2>nul

echo.
echo [4/4] Done!
echo   milestone3_trackA.pdf  (Track A — Research Paper)
echo   milestone3_trackB.pdf  (Track B — System Documentation)
echo ============================================================
pause
