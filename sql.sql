-- drop database if exists db_jobfinder;

CREATE DATABASE IF NOT EXISTS db_jobfinder
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE db_jobfinder;

 -- ***************************************** tbl_users 
create table tbl_users(
	id int auto_increment primary key,
    name varchar(200) not null,
    gender enum('male','female','other') default 'other',
    email varchar(200) unique not null,
    password varchar(200) not null,
    role enum('seeker','company','admin') default 'seeker',
    token varchar(200)  unique,
    is_active enum('0','1') default '1',
    is_verify enum('0','1') default '0',
    verification_token varchar(200),
    verification_expired  datetime default null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
);
-- ======================================== =================seekers
-- ============ =======seeker_profile
create table tbl_seekers(
	id int primary key auto_increment,
    user_id int not null,
    headline varchar(200),
    bio text,
    phone varchar(200),
    location varchar(200),
    avatar varchar(200) default 'https://ui-avatars.com/api/?name=User&background=random',
    created_at timestamp default current_timestamp ,
    updated_at timestamp default current_timestamp on update current_timestamp,
    constraint fk_seekers_users foreign key (user_id) references tbl_users(id) on delete cascade on update cascade
    
);
-- ===================tbl_seeker_experience
create table tbl_seeker_experiences(
	id int auto_increment primary key,
    seeker_id int not null,
    company_name varchar(200),
    position varchar(200),
    start_date date,
    end_date date,
    description text,
    constraint fk_seeker_experiences_seeker foreign key(seeker_id) references tbl_seekers(id) on update cascade on delete cascade,
    constraint chk_experiences_date check (end_date is null or end_date >= start_date)
);


-- ====================================================company
create table tbl_companies(
	id int auto_increment primary key,
    user_id int,
    industry varchar(200),
    logo varchar(255),
    description varchar(200),
    location varchar(200),
    created_at timestamp default current_timestamp ,
    updated_at timestamp default current_timestamp on update current_timestamp,
    constraint fk_companys_users foreign key (user_id) references tbl_users(id) on update cascade on delete cascade
);

create table tbl_categories(
	id int primary key auto_increment,
    name varchar(200)
);
create table tbl_jobs(
	id int auto_increment primary key,
    company_id int,
    category_id int ,
    title varchar(200),
    thumbnail varchar(200),
    description varchar(200),
    requirements varchar(200),
    type enum('full_time','part_time'),
    location varchar(200),
    salary_min decimal(10,2),
    salary_max decimal(10,2),
    status enum('draft','active','closed') default 'active',
    expired_at date,
    created_at timestamp default current_timestamp ,
    updated_at timestamp default current_timestamp on update current_timestamp,
    constraint fk_jobs_companies foreign key(company_id) references tbl_companies(id) on update cascade on delete cascade,
    constraint fk_jobs_categories foreign key (category_id) references tbl_categories(id) on update set null on delete set null 
);
create table tbl_applications(
	id int primary key auto_increment,
    job_id int ,
    
    seeker_id int,
    cv_id int,
    cover_letter varchar(200),
    status enum('pending','accept','reject') default 'pending',
    reviewed_at datetime,
    review_by int,
    applied_at datetime
);
create table tbl_application_status_log(
	id int primary key auto_increment ,
    application_id int,
    change_by int,
    old_status enum('pending','accept','reject'),
    new_status enum('pending','accept','reject'),
    note text,
    change_at datetime,
    constraint fk_application_status_log_applications foreign key (application_id) references tbl_applications(id) on update cascade on delete cascade
);

create table tbl_report(
	id int auto_increment primary key,
    scope enum('global','company'),
    scope_id int,
    data json ,
    generate_at datetime
);



