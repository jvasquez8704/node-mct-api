INSERT INTO profile (title, description, created_at, updated_at) VALUES('dev', '', now(), null);
INSERT INTO profile (title, description, created_at, updated_at) VALUES('data_scient', '', now(), null);
INSERT into users
(str_id, username, "password", email, is_active, created_at, updated_at, last_login_at, profile_id)
VALUES('O8boEKCJjEMhVS9bbNjcpEunXaD2', 'rhernandez', 'pass1234', 'rhernandez@gmail.com', true, now(), null, null, 1);
VALUES('rhernandez', 'pass1234', 'rhernandez@gmail.com', now(), now(), null, 1);
INSERT INTO gene ("name", description, is_active, created_at, updated_at) VALUES('Gene 1', '', true, now(), now());
INSERT INTO score_rule ("name", description, is_active, created_at, updated_at) VALUES('Scoring rule 1', '', true, now(), null);
INSERT INTO media ("name", description, is_active, created_at, updated_at) VALUES('movie 1', '', false, now(), null);

--Categories
INSERT INTO category_type
("name", description, is_active, created_at, updated_at)
VALUES('category', '', true, now(), null);

INSERT INTO category_type
("name", description, is_active, created_at, updated_at)
VALUES('sub category', '', true, now(), null);

INSERT into category
("name", description, is_active, created_at, updated_at, parent_id, type_id)
VALUES('Context', '', true, now(), null, null, 1);

INSERT into category
("name", description, is_active, created_at, updated_at, parent_id, type_id)
VALUES('Characters', '', true, now(), null, null, 1);

INSERT into category
("name", description, is_active, created_at, updated_at, parent_id, type_id)
VALUES('Plot', '', true, now(), null, null, 1);

INSERT into category
("name", description, is_active, created_at, updated_at, parent_id, type_id)
VALUES('Realization', '', true, now(), null, null, 1);

INSERT into category
("name", description, is_active, created_at, updated_at, parent_id, type_id)
VALUES('Mood', '', true, now(), null, null, 1);

INSERT into category
("name", description, is_active, created_at, updated_at, parent_id, type_id)
VALUES('Cinematic Dominance', '', true, now(), null, null, 1);

INSERT into category
("name", description, is_active, created_at, updated_at, parent_id, type_id)
VALUES('Genre / Stylistic Influence', '', true, now(), null, null, 1);

--Sub categories
INSERT into category
("name", description, is_active, created_at, updated_at, parent_id, type_id)
VALUES('Summary', '', true, now(), null, null, 1);


--Sub sub categories
INSERT into category
("name", description, is_active, created_at, updated_at, parent_id, type_id)
VALUES('Setting', '', true, now(), null, 1, 2);


INSERT into category
("name", description, is_active, created_at, updated_at, parent_id, type_id)
VALUES('Summary', '', true, now(), null, 9, 2);

INSERT into category
("name", description, is_active, created_at, updated_at, parent_id, type_id)
VALUES('Type', '', true, now(), null, 9, 2);

INSERT into category
("name", description, is_active, created_at, updated_at, parent_id, type_id)
VALUES('Element', '', true, now(), null, 9, 2);

INSERT into category
("name", description, is_active, created_at, updated_at, parent_id, type_id)
VALUES('Locale', '', true, now(), null, 9, 2);

-- document types
INSERT INTO doc_type
(title, description, is_active, created_at, updated_at)
VALUES('general', '', true, now(), null);

INSERT INTO doc_type
(title, description, is_active, created_at, updated_at)
VALUES('sub_subcategory', '', true, now(), null);

-- doc
INSERT INTO public.doc
(str_id, title, subtitle, document_name, summary, description, long_description, is_active, archived, created_at, last_update_date, "version", type_id, created_by, last_updated_by)
VALUES('O8boEKCJjEMhVS9bbNjcpEunXaD2', 'Katch Media Genome Manual', 'Coding Protocol', 'Document 0002', 'Welcome to the Katch Media Genome Manual, a robust document aimed at standardizing and elucidating our genomic approach to film and TV coding.', 'A description ...', 'A long very description ...', true, true, now(), null, 'v.0.0.1', 1, 1, null);

INSERT INTO public.doc
(str_id, title, subtitle, document_name, summary, description, long_description, is_active, archived, created_at, last_update_date, "version", type_id, created_by, last_updated_by)
VALUES('O8boEKCJjEMhVS9bbNjcpEunXaD3', 'Katch Media Genome Manual', 'Introduction', 'Document 0002', 'Welcome to the Katch Media Genome Manual, a robust document aimed at standardizing and elucidating our genomic approach to film and TV coding.', 'A description ...', 'A long very description ...', true, true, now(), null, 'v.0.0.1', 1, 1, null);


INSERT INTO public.info_chunk
("content", is_active, created_at, updated_at, doc_id)
VALUES('Test contenido largo 1', true, now(), null, 1);

INSERT INTO public.info_chunk
("content", is_active, created_at, updated_at, doc_id)
VALUES('Test contenido largo 2', true, now(), null, 1);

INSERT INTO public.info_chunk
("content", is_active, created_at, updated_at, doc_id)
VALUES('Test contenido largo 1', true, now(), null, 2);

INSERT INTO public.info_chunk
("content", is_active, created_at, updated_at, doc_id)
VALUES('Test contenido largo 2', true, now(), null, 2);


-- code_genome
INSERT INTO media_category
(title, description, is_active, created_at, updated_at, media_id, category_id, doc_id, score_rule_id, gene_id)
VALUES('', '', true, now(), null, 1, 10, 2, 1, 1);

-- node 
INSERT into note
(is_active, created_at, updated_at, user_id, doc_id)
VALUES(true, now(), null, 1, 2);

-- version
INSERT INTO "version"
(tag, body, is_active, created_at, updated_at, note_id)
VALUES('v.0.0.1', 'Esta es una nota de prueba...', true, now(), null, 1);