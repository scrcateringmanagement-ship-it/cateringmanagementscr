give permissions 777 to storage/framework and logs and bootstrap/cache

php artisan storage link 
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan optimize


in web .php 
Route::get('/', function () {
    return redirect('https://cateringmanagement.indianrailways.gov.in/CATADMIN');
});

# Database (Active)
# DB_CONNECTION=mysql
# DB_HOST=10.11.5.139
# DB_PORT=3306
# DB_DATABASE=contractbasemangmentsystem
# DB_USERNAME=cateringmanagement
# DB_PASSWORD=ScR_ContMAnaGemeNT!097*012


 cateringmanagement     | 10.11.5.138 | contractbasemangmentsystem 

create user 'cateringmanagement'@'10.11.5.218' identified by 'ScR_ContMAnaGemeNT!097*012';
grant all privileges on contractbasemangmentsystem.* to 'cateringmanagement'@'10.11.5.218';


ALTER USER 'cateringmanagement'@'10.11.5.138' IDENTIFIED BY 'ScR_ContMAnaGemeNT!097*012';


grant all privileges on contractbasemangmentsystem.* to 'cateringmanagement'@'10.11.5.138';

create user 'cateringmanagement'@'10.11.5.21' identified by 'ScR_ContMAnaGemeNT!097*012';
grant all privileges on contractbasemangmentsystem.* to 'cateringmanagement'@'10.11.5.219';



create user 'cateringmanagement'@'10.11.5.221' identified by 'ScR_ContMAnaGemeNT!097*012';
grant all privileges on contractbasemangmentsystem.* to 'cateringmanagement'@'10.11.5.221';


git commannds after sent to production

git init
git add .
git commit -m "UPDATED view id card in form application and approver  updated date - 2025-09-22"


serve in local ip

post method
https://cateringmanagement.indianrailways.gov.in/api/admin/maintenance
{"enable":"true"}