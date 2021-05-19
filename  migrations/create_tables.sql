CREATE TABLE profile (
	id serial PRIMARY KEY,
	title VARCHAR ( 100 ),
	description VARCHAR ( 255 ),
	is_active BOOLEAN,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);

CREATE TABLE users (
	id serial PRIMARY KEY,
	str_id VARCHAR ( 50 ) UNIQUE NOT NULL,
	username VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 50 ) NOT NULL,
	email VARCHAR ( 255 ) NOT NULL,
	is_active BOOLEAN,
	created_at TIMESTAMP,
	updated_at TIMESTAMP,
    last_login_at TIMESTAMP,
   	profile_id INT,
   	FOREIGN KEY (profile_id) REFERENCES profile (id)
);

CREATE TABLE gene (
	id serial PRIMARY KEY,
	name VARCHAR ( 255 ),
	description TEXT,
	is_active BOOLEAN,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);

CREATE TABLE score_rule (
	id serial PRIMARY KEY,
	name VARCHAR ( 255 ),
	description TEXT,
	is_active BOOLEAN,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);

CREATE TABLE media (
	id serial PRIMARY KEY,
	name VARCHAR ( 255 ),
	description TEXT,
	is_active BOOLEAN,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);

CREATE TABLE category_type (
	id serial PRIMARY KEY,
	name VARCHAR ( 255 ),
	description TEXT,
	is_active BOOLEAN,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);

CREATE TABLE category (
	id serial PRIMARY KEY,
	name VARCHAR ( 255 ),
	description TEXT,
	is_active BOOLEAN,
	created_at TIMESTAMP,
	updated_at TIMESTAMP,
	parent_id INT,
	type_id INT,
   	FOREIGN KEY (parent_id) REFERENCES category (id),
    FOREIGN KEY (type_id) REFERENCES category_type (id)
);

CREATE TABLE doc_type (
	id serial PRIMARY KEY,
	title VARCHAR ( 255 ),
	description TEXT,
	is_active BOOLEAN,
	created_at TIMESTAMP,
	updated_at TIMESTAMP
);

CREATE TABLE doc (
	id serial PRIMARY KEY,
	str_id VARCHAR ( 50 ),
	title VARCHAR ( 100 ),
	subtitle VARCHAR ( 100 ),
	document_name VARCHAR ( 50 ),
	summary VARCHAR ( 255 ),
	description TEXT,
	long_description TEXT,
	is_active BOOLEAN,
	archived BOOLEAN,
	created_at TIMESTAMP,
	last_update_date TIMESTAMP,
	version VARCHAR ( 25 ),
	type_id INT,
	created_by INT,
	last_updated_by INT,
	FOREIGN KEY (type_id) REFERENCES doc_type (id),
	FOREIGN KEY (created_by) REFERENCES users (id),
	FOREIGN KEY (last_updated_by) REFERENCES users (id)
);

CREATE TABLE info_chunk (
	id serial PRIMARY KEY,
	content TEXT,
	is_active BOOLEAN,
	created_at TIMESTAMP,
	updated_at TIMESTAMP,
	doc_id INT,
    FOREIGN KEY (doc_id) REFERENCES doc (id)
);

-- genome_code 
CREATE TABLE media_category (
	id serial PRIMARY KEY,
	title TEXT,
	description TEXT,
	is_active BOOLEAN,
	created_at TIMESTAMP,
	updated_at TIMESTAMP,
	media_id INT,
	category_id INT,
	doc_id INT,
	score_rule_id INT,
	gene_id INT,
   	FOREIGN KEY (media_id) REFERENCES media (id),
    FOREIGN KEY (category_id) REFERENCES category (id),
    FOREIGN KEY (doc_id) REFERENCES doc (id),
    FOREIGN KEY (score_rule_id) REFERENCES score_rule (id),
    FOREIGN KEY (gene_id) REFERENCES gene (id)
);

CREATE TABLE note (
	id serial PRIMARY KEY,
	is_active BOOLEAN,
	created_at TIMESTAMP,
	updated_at TIMESTAMP,
	user_id INT,
	doc_id INT,
   	FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (doc_id) REFERENCES doc (id)
);

CREATE TABLE version (
	id serial PRIMARY KEY,
	tag VARCHAR ( 255 ),
	body TEXT,
	is_active BOOLEAN,
	created_at TIMESTAMP,
	updated_at TIMESTAMP,
	note_id INT,
    FOREIGN KEY (note_id) REFERENCES note (id)
);