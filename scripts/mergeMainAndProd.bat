@echo off

call git checkout main
call git push
call git checkout production
call git merge main
call git push
call git checkout main