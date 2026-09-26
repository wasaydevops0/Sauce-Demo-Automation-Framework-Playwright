@echo off
echo Reproducing Bug QA-2: Intentional Failure Test
npx playwright test tests/intentional_fail.spec.js --headed
echo Test run complete.
