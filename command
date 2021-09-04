npm install  sequelize mysql2 sequelize-cli -g
npm install -g cookie-parser express-basic-auth jsonwebtoken cors http-errors jwt-blacklist bcrypt date-and-time

npm install moment

sequelize model:generate --name User --attributes "username:string,last_name:string,first_name:string,email:string,mobile:string,is_verify:integer,image:string,password:string,address:text,is_block:integer"  --underscored

sequelize model:generate --name Service --attributes "title_en:string,title_ar:string,image:string,is_publish:integer"  --underscored

sequelize model:generate --name Category --attributes "title_en:string,title_ar:string,image:string,is_publish:integer"  --underscored

sequelize model:generate --name City --attributes "title_en:string,title_ar:string,code:string,is_publish:integer"  --underscored
sequelize model:generate --name Unit --attributes "title_en:string,title_ar:string,image:string,is_publish:integer"  --underscored

sequelize model:generate --name ProjectUnit --attributes "unit_id:integer,project_id:integer"  --underscored

sequelize model:generate --name UnitSpecification --attributes "project_unit_id:integer,title_en:string,title_ar:string,dimension_en:string,dimension_ar:string"  --underscored

sequelize model:generate --name UserUnit --attributes "user_id:integer,project_id:integer,project_unit_id:integer,started_at:date,status:integer"  --underscored


sequelize model:generate --name Project --attributes "title_en:string,title_ar:string,description_en:text,description_ar:text,image:string,is_publish:integer,is_featured:integer,progress_status:integer,latitude:string,longitude:string,address:string,city_id:integer,type:integer,category_id:integer"  --underscored

sequelize model:generate --name ProjectImage --attributes "project_id:integer,image:string"  --underscored

sequelize model:generate --name ProjectService --attributes "project_id:integer,service_id:integer"  --underscored

sequelize model:generate --name Slider --attributes "object_id:integer,object_type:integer,image:string,is_publish:integer"  --underscored

sequelize model:generate --name Payment --attributes "user_id:integer,project_id:integer,unit_id:integer,date:date,unit_user_id:integer,status:integer,notes:text,payment_status:integer,due_date:date,amount:float"  --underscored

sequelize model:generate --name PostponementRequest --attributes "user_id:integer,payment_id:integer,to_date:date,status:integer"  --underscored

Postponement payment request

sequelize model:generate --name Article --attributes "title_en:string,title_ar:string,image:string,is_publish:integer"  --underscored
sequelize model:generate --name MediaCenter --attributes "title_en:string,title_ar:string,youtube_link:string,is_publish:integer"  --underscored

sequelize model:generate --name PageTitle --attributes "page_id:integer,key:string,title_en:string,title_ar:string"  --underscored


sequelize model:generate --name Setting --attributes "key:string,value:string,value_ar:string,options:integer"  --underscored
sequelize model:generate --name RequestCall --attributes "user_id:integer"  --underscored
sequelize model:generate --name Shoowroom --attributes "latitude:string,longitude:string,address_en:string,address_ar:string,city_id:integer"  --underscored
sequelize model:generate --name ImportedContact --attributes "user_id:integer,mobile:string" --underscored
sequelize model:generate --name ImportedMobile --attributes "imported_contact_id:integer,mobile:string" --underscored

sequelize model:generate --name Subject --attributes "title_en:string,title_ar:string,code:string,is_publish:integer"  --underscored
sequelize model:generate --name Postpone --attributes "user_id:integer,postpone_at:string,status:integer"  --underscored
sequelize model:generate --name Notification --attributes "title_en:string,title_ar:string,user_id:integer,message_en:text,message_ar:text,integer:string,type:integer,user_model:integer"  --underscored
