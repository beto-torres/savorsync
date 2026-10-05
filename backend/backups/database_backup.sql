--
-- PostgreSQL database dump
--

\restrict WCRQh2tT6etUeuzcTS7oqVKEbzPrkaKohLIscsXEVHECl1WjVU5vZzBGpMZb05z

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.solicitacoes_recuperacao_senha DROP CONSTRAINT IF EXISTS solicitacoes_recuperacao_senha_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.avaliacoes DROP CONSTRAINT IF EXISTS avaliacoes_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.avaliacoes DROP CONSTRAINT IF EXISTS avaliacoes_refeicao_id_fkey;
DROP INDEX IF EXISTS public.usuarios_email_unico_idx;
DROP INDEX IF EXISTS public.solicitacoes_recuperacao_senha_data_idx;
DROP INDEX IF EXISTS public.refeicoes_nome_idx;
DROP INDEX IF EXISTS public.refeicoes_data_idx;
DROP INDEX IF EXISTS public.avaliacoes_usuario_id_idx;
DROP INDEX IF EXISTS public.avaliacoes_servido_em_idx;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_email_key;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_cpf_key;
ALTER TABLE IF EXISTS ONLY public.solicitacoes_recuperacao_senha DROP CONSTRAINT IF EXISTS solicitacoes_recuperacao_senha_usuario_id_key;
ALTER TABLE IF EXISTS ONLY public.solicitacoes_recuperacao_senha DROP CONSTRAINT IF EXISTS solicitacoes_recuperacao_senha_pkey;
ALTER TABLE IF EXISTS ONLY public.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.refeicoes DROP CONSTRAINT IF EXISTS refeicoes_pkey;
ALTER TABLE IF EXISTS ONLY public.refeicoes DROP CONSTRAINT IF EXISTS refeicoes_data_periodo_key;
ALTER TABLE IF EXISTS ONLY public.avaliacoes DROP CONSTRAINT IF EXISTS avaliacoes_usuario_id_refeicao_id_servido_em_key;
ALTER TABLE IF EXISTS ONLY public.avaliacoes DROP CONSTRAINT IF EXISTS avaliacoes_pkey;
ALTER TABLE IF EXISTS public.refeicoes ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.usuarios;
DROP TABLE IF EXISTS public.solicitacoes_recuperacao_senha;
DROP TABLE IF EXISTS public.schema_migrations;
DROP SEQUENCE IF EXISTS public.refeicoes_id_seq;
DROP TABLE IF EXISTS public.refeicoes;
DROP TABLE IF EXISTS public.avaliacoes;
DROP TYPE IF EXISTS public.tipo_usuario;
DROP TYPE IF EXISTS public.periodo_refeicao;
DROP EXTENSION IF EXISTS pgcrypto;
--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: periodo_refeicao; Type: TYPE; Schema: public; Owner: cardapio
--

CREATE TYPE public.periodo_refeicao AS ENUM (
    'manha',
    'almoco',
    'tarde'
);


ALTER TYPE public.periodo_refeicao OWNER TO cardapio;

--
-- Name: tipo_usuario; Type: TYPE; Schema: public; Owner: cardapio
--

CREATE TYPE public.tipo_usuario AS ENUM (
    'administrador',
    'cozinha',
    'aluno'
);


ALTER TYPE public.tipo_usuario OWNER TO cardapio;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: avaliacoes; Type: TABLE; Schema: public; Owner: cardapio
--

CREATE TABLE public.avaliacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    refeicao_id integer NOT NULL,
    servido_em date NOT NULL,
    nota smallint NOT NULL,
    comentario character varying(500),
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT avaliacoes_nota_check CHECK (((nota >= 1) AND (nota <= 5)))
);


ALTER TABLE public.avaliacoes OWNER TO cardapio;

--
-- Name: refeicoes; Type: TABLE; Schema: public; Owner: cardapio
--

CREATE TABLE public.refeicoes (
    id integer NOT NULL,
    periodo public.periodo_refeicao NOT NULL,
    descricao text NOT NULL,
    data date NOT NULL,
    nome character varying(120) NOT NULL,
    imagem_url character varying(2048),
    CONSTRAINT refeicoes_imagem_url_valida CHECK (((imagem_url IS NULL) OR ((imagem_url)::text ~ '^https://'::text)))
);


ALTER TABLE public.refeicoes OWNER TO cardapio;

--
-- Name: refeicoes_id_seq; Type: SEQUENCE; Schema: public; Owner: cardapio
--

CREATE SEQUENCE public.refeicoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refeicoes_id_seq OWNER TO cardapio;

--
-- Name: refeicoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cardapio
--

ALTER SEQUENCE public.refeicoes_id_seq OWNED BY public.refeicoes.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: cardapio
--

CREATE TABLE public.schema_migrations (
    name text NOT NULL,
    applied_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.schema_migrations OWNER TO cardapio;

--
-- Name: solicitacoes_recuperacao_senha; Type: TABLE; Schema: public; Owner: cardapio
--

CREATE TABLE public.solicitacoes_recuperacao_senha (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    senha_hash text NOT NULL,
    solicitado_em timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.solicitacoes_recuperacao_senha OWNER TO cardapio;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: cardapio
--

CREATE TABLE public.usuarios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome character varying(120) NOT NULL,
    cpf character(11) NOT NULL,
    telefone character varying(20) NOT NULL,
    email character varying(160) NOT NULL,
    senha_hash text NOT NULL,
    tipo public.tipo_usuario DEFAULT 'aluno'::public.tipo_usuario NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT usuarios_cpf_check CHECK ((cpf ~ '^[0-9]{11}$'::text))
);


ALTER TABLE public.usuarios OWNER TO cardapio;

--
-- Name: refeicoes id; Type: DEFAULT; Schema: public; Owner: cardapio
--

ALTER TABLE ONLY public.refeicoes ALTER COLUMN id SET DEFAULT nextval('public.refeicoes_id_seq'::regclass);


--
-- Data for Name: avaliacoes; Type: TABLE DATA; Schema: public; Owner: cardapio
--

COPY public.avaliacoes (id, usuario_id, refeicao_id, servido_em, nota, comentario, criado_em) FROM stdin;
f31a3881-374d-4a0f-8d38-3ebaf735ea0f	fce07bd2-0abe-49a2-af26-7508b7b6aea0	4	2026-08-25	5	o cachorro tava bem temperado. ameiiiii	2026-08-25 11:09:31.748335-03
6384f5d7-3f2b-4cf7-ab2a-fea9f4c6dac6	47fc8838-00ed-4d8c-a348-e77877703503	4	2026-08-25	1	muito salgado	2026-08-25 12:52:58.048964-03
73c09796-156c-4896-9b36-cbdfa084c42b	da593bba-f6eb-4d54-b83a-e05554d9dff0	4	2026-08-25	3	Precisa de menos óleo, e de menos sal.	2026-08-25 13:00:15.577369-03
2e71f802-cca8-4baf-925f-906994588bed	c36f016a-fbc7-45cf-a547-ba989672d072	55	2026-09-21	1	queria pizza :(	2026-09-21 13:01:55.817677-03
0a471826-6fbb-4144-83ef-e008d166ffe6	71800530-dbb1-4f13-ad9a-350c4c866ab6	4	2026-08-25	1	muito oleoso e tbm muito salgado, minha pressão aumentou muito!!!!!!! manda o pix de R$ 50,00	2026-08-25 13:00:27.129844-03
4b99bbda-2e77-4492-93a6-bb3658511de7	344f94c3-d875-4317-ac68-4a9a867db18e	64	2026-09-24	3	\N	2026-09-24 18:33:39.410512-03
6b9f21e5-e55a-40bf-b972-e815ac1e4c1b	344f94c3-d875-4317-ac68-4a9a867db18e	65	2026-09-24	3	Gostei, mas pode melhorar.	2026-09-24 18:44:18.258849-03
89325957-fbf4-4093-80d8-9e86f349aa14	344f94c3-d875-4317-ac68-4a9a867db18e	66	2026-09-25	4	Gostei bastante da refeição.	2026-09-25 15:51:52.659727-03
dcbd2c37-49a0-445d-8de9-a69596243372	344f94c3-d875-4317-ac68-4a9a867db18e	67	2026-09-25	5	Estava tudo muito gostoso.	2026-09-25 16:28:17.766363-03
7b5ccb18-d330-4c4d-8649-12fe4c4078d6	344f94c3-d875-4317-ac68-4a9a867db18e	68	2026-09-25	1	Não gostei da refeição.	2026-09-25 15:54:35.304736-03
c78aa18d-47fb-41c8-ab2d-0227641cc81d	344f94c3-d875-4317-ac68-4a9a867db18e	69	2026-09-28	1	A refeição não estava agradável.	2026-09-28 17:03:35.121984-03
5edb7cd9-da24-472a-8557-e0b87d347a41	344f94c3-d875-4317-ac68-4a9a867db18e	70	2026-09-28	3	A refeição estava razoável.	2026-09-28 17:35:11.165743-03
6f39ab1c-c535-42bf-95f7-ade8f0f92a83	344f94c3-d875-4317-ac68-4a9a867db18e	71	2026-09-28	2	Poderia estar mais saborosa.	2026-09-28 17:09:25.78107-03
81d4281d-aab6-44a8-a149-8a8a3e98dc15	344f94c3-d875-4317-ac68-4a9a867db18e	72	2026-09-29	5	Excelente refeição!	2026-09-29 14:38:39.897108-03
03686028-a04f-4d0e-9f1d-afdada127b86	344f94c3-d875-4317-ac68-4a9a867db18e	73	2026-09-29	1	A refeição não estava agradável.	2026-09-29 18:05:42.32318-03
bb275d0f-acf5-419e-a8ed-5a21f6e1a987	344f94c3-d875-4317-ac68-4a9a867db18e	74	2026-09-29	4	Estava muito saborosa.	2026-09-29 14:11:34.541605-03
19e4f78f-d2b9-4bac-b931-d82938d7be67	344f94c3-d875-4317-ac68-4a9a867db18e	75	2026-09-30	4	Estava muito saborosa.	2026-09-30 17:03:27.196557-03
92736d6c-1888-46ba-8624-ba27db52de18	344f94c3-d875-4317-ac68-4a9a867db18e	76	2026-09-30	4	\N	2026-09-30 13:37:46.546799-03
6435ec5f-6af2-4e13-9af4-5bfa133a9ce5	344f94c3-d875-4317-ac68-4a9a867db18e	77	2026-09-30	3	Gostei, mas pode melhorar.	2026-09-30 13:05:37.593216-03
e9960cb4-e419-4b04-9009-f16ad4abfbe8	344f94c3-d875-4317-ac68-4a9a867db18e	85	2026-10-05	5	Adorei o cardápio de hoje!	2026-10-05 14:55:20.272071-03
c92d4545-0701-4c99-b74c-006981264ed9	344f94c3-d875-4317-ac68-4a9a867db18e	86	2026-10-05	5	Adorei o cardápio de hoje!	2026-10-05 16:25:48.994776-03
d2fba959-8778-49a9-8bab-36f14cfca502	344f94c3-d875-4317-ac68-4a9a867db18e	87	2026-10-06	5	Excelente refeição!	2026-10-06 16:22:35.371456-03
6ab4242e-6a7f-4563-bd2c-6b80cf555f07	344f94c3-d875-4317-ac68-4a9a867db18e	88	2026-10-06	4	Boa refeição e bem servida.	2026-10-06 18:56:59.050666-03
2d237115-0673-4406-9146-22785c6f8886	344f94c3-d875-4317-ac68-4a9a867db18e	89	2026-10-06	5	Estava tudo muito gostoso.	2026-10-06 14:00:24.956153-03
7466593b-af75-4635-8f00-354b5d5f06d4	344f94c3-d875-4317-ac68-4a9a867db18e	90	2026-10-07	4	Gostei bastante da refeição.	2026-10-07 17:20:17.121926-03
ee9fad96-4acb-402d-bf92-555e419bf3b4	344f94c3-d875-4317-ac68-4a9a867db18e	91	2026-10-07	4	Gostei bastante da refeição.	2026-10-07 18:53:57.251493-03
b025a543-4f6f-4be2-a1aa-5065d0a3ff8d	344f94c3-d875-4317-ac68-4a9a867db18e	92	2026-10-07	4	\N	2026-10-07 18:55:09.093073-03
941219e8-8dcb-4569-94b0-d8e77f50c6df	344f94c3-d875-4317-ac68-4a9a867db18e	93	2026-10-08	3	Estava boa no geral.	2026-10-08 16:17:45.273393-03
dbc67884-c6b4-420f-883c-bfd6605b32d8	344f94c3-d875-4317-ac68-4a9a867db18e	58	2026-09-22	3	\N	2026-09-22 18:29:46.486377-03
192296da-6908-4450-8168-6189f5c2a8cd	344f94c3-d875-4317-ac68-4a9a867db18e	61	2026-09-23	4	\N	2026-09-23 13:40:08.093735-03
182007c5-14f3-4fd7-9e29-f443e34a7cfd	344f94c3-d875-4317-ac68-4a9a867db18e	56	2026-09-21	1	Não gostei da refeição.	2026-09-21 14:18:22.044844-03
65b7793c-7ae6-4dbf-ad23-feb008d28e58	344f94c3-d875-4317-ac68-4a9a867db18e	59	2026-09-22	2	\N	2026-09-22 15:05:03.463988-03
0900589b-12f8-4df3-880c-e2f0cc116613	344f94c3-d875-4317-ac68-4a9a867db18e	62	2026-09-23	5	Estava tudo muito gostoso.	2026-09-23 17:48:46.106382-03
1edeeccd-5a3c-419d-8795-5075d9b8e5fa	344f94c3-d875-4317-ac68-4a9a867db18e	63	2026-09-24	5	Estava tudo muito gostoso.	2026-09-24 17:45:38.752391-03
37d7554f-f67b-4d49-aac4-5709ef288d78	344f94c3-d875-4317-ac68-4a9a867db18e	94	2026-10-08	3	Estava boa no geral.	2026-10-08 15:40:30.907854-03
8bac0f46-6034-44bb-a6a0-00cb13de1e18	344f94c3-d875-4317-ac68-4a9a867db18e	95	2026-10-08	5	Estava tudo muito gostoso.	2026-10-08 13:22:14.594147-03
6361c523-6bf0-4a2c-a245-dfcd85ee8b5e	344f94c3-d875-4317-ac68-4a9a867db18e	80	2026-10-01	4	Gostei bastante da refeição.	2026-10-01 15:15:33.201658-03
76578b92-7137-404d-8e4e-06b9c45ee31a	344f94c3-d875-4317-ac68-4a9a867db18e	81	2026-10-02	4	Boa refeição e bem servida.	2026-10-02 18:21:22.900962-03
02d55d13-55b5-48a4-bd78-164e71335864	344f94c3-d875-4317-ac68-4a9a867db18e	83	2026-10-02	5	\N	2026-10-02 15:59:33.867807-03
991ac886-8fb6-4b3e-9a93-e8ebee7d4958	344f94c3-d875-4317-ac68-4a9a867db18e	84	2026-10-05	4	\N	2026-10-05 18:53:39.29399-03
9c1a18b9-6f1d-47a0-8cc0-4b98b9fd824e	344f94c3-d875-4317-ac68-4a9a867db18e	96	2026-10-09	2	A apresentação poderia melhorar.	2026-10-09 16:22:23.329333-03
d60fb9cc-51e3-476f-843c-20d526b5bb30	344f94c3-d875-4317-ac68-4a9a867db18e	97	2026-10-09	3	Estava boa no geral.	2026-10-09 16:52:16.970042-03
d54a66f9-8c15-4143-98ad-4d090c4d23a1	344f94c3-d875-4317-ac68-4a9a867db18e	98	2026-10-09	3	\N	2026-10-09 13:39:53.540596-03
e29f0635-cc84-4c2e-94ff-c7e99265d11c	344f94c3-d875-4317-ac68-4a9a867db18e	55	2026-09-21	2	\N	2026-09-21 16:32:35.428635-03
d0f88a66-9c1d-47d3-94e4-137e4fb035ea	344f94c3-d875-4317-ac68-4a9a867db18e	54	2026-09-21	2	\N	2026-09-21 14:17:34.999867-03
939b9e2f-1776-4f8d-bf4e-120d13e0009b	344f94c3-d875-4317-ac68-4a9a867db18e	60	2026-09-23	5	Adorei o cardápio de hoje!	2026-09-23 14:14:23.49827-03
858e09b9-2894-49e3-bb6d-71f3c1f7585e	344f94c3-d875-4317-ac68-4a9a867db18e	57	2026-09-22	2	Poderia estar mais saborosa.	2026-09-22 13:32:22.313559-03
6049185b-60dc-47ce-945a-fa6d912044da	344f94c3-d875-4317-ac68-4a9a867db18e	78	2026-10-01	5	Excelente refeição!	2026-10-01 13:35:49.470653-03
9cb65a75-e289-448b-bdf8-8677826f7948	344f94c3-d875-4317-ac68-4a9a867db18e	79	2026-10-01	2	\N	2026-10-01 16:37:49.930607-03
6cff4372-450a-4f6e-9955-afc539e4a9cc	344f94c3-d875-4317-ac68-4a9a867db18e	82	2026-10-02	4	Gostei bastante da refeição.	2026-10-02 14:13:30.647904-03
45b776cc-b44b-43b8-99cd-33294ea2f058	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	64	2026-09-24	3	Gostei, mas pode melhorar.	2026-09-24 14:08:54.238102-03
e42bfbad-76cf-4835-8ccb-0cea798dd13d	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	65	2026-09-24	4	Gostei bastante da refeição.	2026-09-24 17:47:04.34523-03
9c48ea33-d289-40ca-b4a4-1930d96a6748	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	66	2026-09-25	5	Estava tudo muito gostoso.	2026-09-25 14:39:38.020853-03
abf645ba-ef08-430c-a26a-d71d63af2cf8	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	67	2026-09-25	4	Gostei bastante da refeição.	2026-09-25 15:41:27.589675-03
f2a2e412-e922-47f5-8e9c-c23dbf30e8c7	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	68	2026-09-25	3	Gostei, mas pode melhorar.	2026-09-25 17:41:14.749919-03
308de2ad-2dc9-4116-83d0-4a1189b15dd4	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	69	2026-09-28	4	Estava muito saborosa.	2026-09-28 18:02:03.348242-03
5e258ea9-9c7e-47b7-9734-564a9b3791c1	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	70	2026-09-28	4	Boa refeição e bem servida.	2026-09-28 16:19:21.558935-03
2075b338-dda7-4318-8920-52f6e28a33c3	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	71	2026-09-28	5	Adorei o cardápio de hoje!	2026-09-28 16:42:53.644089-03
573043f5-9c65-477f-9bde-3bf2641be522	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	72	2026-09-29	5	Adorei o cardápio de hoje!	2026-09-29 18:35:02.694734-03
0d69143a-e999-4021-89d0-959b1d79604f	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	73	2026-09-29	5	Adorei o cardápio de hoje!	2026-09-29 14:45:13.685816-03
20b5122f-aeb4-4383-80f2-92904d490e1c	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	74	2026-09-29	5	Adorei o cardápio de hoje!	2026-09-29 13:43:03.983938-03
38f3c6bd-4069-45f7-b357-0124a996212f	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	75	2026-09-30	2	A apresentação poderia melhorar.	2026-09-30 16:32:47.760576-03
cfb9dd17-8a2a-43e9-b407-0d642fbcb5d3	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	76	2026-09-30	1	\N	2026-09-30 14:27:20.647666-03
4cadd439-26ca-4624-8dc3-e5e4c997004a	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	77	2026-09-30	4	\N	2026-09-30 15:12:14.058401-03
2816d439-a028-4741-a3a6-00678fdb7afa	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	85	2026-10-05	5	Estava tudo muito gostoso.	2026-10-05 13:36:56.513653-03
490bc5df-d6db-4f0d-8373-67dcc8180723	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	86	2026-10-05	1	\N	2026-10-05 15:12:42.972087-03
5b77334c-926c-4c48-bf1d-af56a850b38e	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	87	2026-10-06	3	Estava boa no geral.	2026-10-06 14:30:25.820899-03
4883601e-4587-48f6-a8d3-d6f533628e75	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	88	2026-10-06	4	Estava muito saborosa.	2026-10-06 13:58:05.173532-03
96de4cff-e752-44f9-8dee-5d5def9acfab	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	89	2026-10-06	1	O sabor poderia melhorar.	2026-10-06 14:28:51.489775-03
a8d3d968-0207-40a0-88d5-378d9271a2a9	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	90	2026-10-07	3	\N	2026-10-07 13:16:27.137115-03
bf110b9f-9373-49ce-bd36-520f33ac95a2	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	91	2026-10-07	5	Adorei o cardápio de hoje!	2026-10-07 14:56:29.098174-03
eda5113c-365f-4b3b-b97b-a5977d79ecef	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	92	2026-10-07	3	\N	2026-10-07 15:18:40.638433-03
e482fed9-7b21-4302-92d8-28cb10455aa9	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	93	2026-10-08	2	A apresentação poderia melhorar.	2026-10-08 13:06:32.909773-03
37d12140-1081-4fe4-beb9-d46d0e86671a	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	58	2026-09-22	3	\N	2026-09-22 14:11:21.714576-03
77fc34f1-e403-4acc-bdbc-bc17a42c6758	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	61	2026-09-23	5	Adorei o cardápio de hoje!	2026-09-23 18:03:53.480401-03
1819ef28-b8fa-4cf8-acdf-ee9085524fd4	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	56	2026-09-21	4	Boa refeição e bem servida.	2026-09-21 15:05:31.522912-03
3f0950b8-2022-4615-806d-8842fa2bc763	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	59	2026-09-22	4	Estava muito saborosa.	2026-09-22 13:44:37.869829-03
879f5d02-5059-4be6-9ca2-1b6ae3eb2473	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	62	2026-09-23	4	Estava muito saborosa.	2026-09-23 13:36:04.522319-03
86dc7e2f-8907-4df9-96d0-21273da36959	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	63	2026-09-24	1	A refeição não estava agradável.	2026-09-24 13:02:52.062261-03
96e9238d-4684-4833-9292-746bf511e5af	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	94	2026-10-08	2	Achei a refeição abaixo do esperado.	2026-10-08 13:16:43.153955-03
d5128ed8-d7af-458b-b9aa-2ec4529c1ba0	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	95	2026-10-08	4	Boa refeição e bem servida.	2026-10-08 17:49:25.583081-03
19604822-1936-4d82-85c9-a11dd5ce58c0	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	80	2026-10-01	3	Gostei, mas pode melhorar.	2026-10-01 17:30:10.704679-03
1f2bac91-434c-460b-aff7-d8ac276a3e3f	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	81	2026-10-02	4	Estava muito saborosa.	2026-10-02 17:57:04.251304-03
ff0adb53-0b8d-46d8-95c2-2b90aa50d6ac	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	83	2026-10-02	3	Estava boa no geral.	2026-10-02 16:44:22.645467-03
3feb36bf-2ec5-46e1-b7e0-83e9c268c485	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	84	2026-10-05	3	Gostei, mas pode melhorar.	2026-10-05 18:27:01.42266-03
94b7b9d5-0c58-4336-a45c-297082c25de9	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	96	2026-10-09	5	\N	2026-10-09 15:02:13.597613-03
cbb39bc2-b42e-4024-89f7-8af1d98e25e9	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	97	2026-10-09	5	Adorei o cardápio de hoje!	2026-10-09 16:44:04.483145-03
6393ecb3-29e9-4c63-bf0b-68e6747df6ac	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	98	2026-10-09	5	\N	2026-10-09 18:47:04.508664-03
6fd73929-ef20-4d23-91a2-0d9872475e34	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	55	2026-09-21	2	Achei a refeição abaixo do esperado.	2026-09-21 13:07:57.611456-03
9e1031ca-3e85-4fff-8490-14ec614af5a2	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	54	2026-09-21	3	A refeição estava razoável.	2026-09-21 14:40:55.515696-03
c03625dd-36f1-47b9-b063-79e006bbd0d1	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	60	2026-09-23	4	Boa refeição e bem servida.	2026-09-23 17:40:48.08287-03
1c2fbb5b-a955-4fd7-85ed-f1468276e23e	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	57	2026-09-22	4	Gostei bastante da refeição.	2026-09-22 13:08:19.690361-03
88105f92-269f-41f4-8899-ec492dd59343	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	78	2026-10-01	3	Estava boa no geral.	2026-10-01 15:10:33.520366-03
49266da7-0be3-40aa-bc11-49d869ed21bc	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	79	2026-10-01	3	Estava boa no geral.	2026-10-01 17:31:46.293892-03
c5e79bcf-a6fe-4c97-8ee0-8fb3ee420329	3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	82	2026-10-02	3	\N	2026-10-02 15:50:12.915865-03
f3b778f8-7079-4ad1-8710-4f1e468dc6fb	47fc8838-00ed-4d8c-a348-e77877703503	64	2026-09-24	3	Estava boa no geral.	2026-09-24 15:08:25.078571-03
6e708e12-4ac0-4d52-8cb2-ba50756a9815	47fc8838-00ed-4d8c-a348-e77877703503	65	2026-09-24	1	O sabor poderia melhorar.	2026-09-24 18:31:28.105408-03
763352b7-db9b-4a4f-828f-e290c0516c4b	47fc8838-00ed-4d8c-a348-e77877703503	66	2026-09-25	5	\N	2026-09-25 18:02:28.038903-03
b85951ef-1d8a-4f0a-8767-4623e66550de	47fc8838-00ed-4d8c-a348-e77877703503	67	2026-09-25	4	Estava muito saborosa.	2026-09-25 14:59:20.65254-03
5359fc16-8614-4105-8b45-6295319fbde3	47fc8838-00ed-4d8c-a348-e77877703503	68	2026-09-25	4	Gostei bastante da refeição.	2026-09-25 15:41:41.448786-03
0bbe33cd-c5fd-4009-8b1f-06b6f5b709c3	47fc8838-00ed-4d8c-a348-e77877703503	69	2026-09-28	5	Adorei o cardápio de hoje!	2026-09-28 17:20:26.191043-03
590d3450-fbe1-4b28-a25b-c50dd9c3a150	47fc8838-00ed-4d8c-a348-e77877703503	70	2026-09-28	3	A refeição estava razoável.	2026-09-28 17:28:25.962122-03
7c16a261-2935-4f25-8678-e7099bfbe2f8	47fc8838-00ed-4d8c-a348-e77877703503	71	2026-09-28	4	Estava muito saborosa.	2026-09-28 13:36:50.139772-03
f5cea600-5a2f-4602-a680-10ce14579a07	47fc8838-00ed-4d8c-a348-e77877703503	72	2026-09-29	4	Boa refeição e bem servida.	2026-09-29 17:29:30.396768-03
fcfeecde-4ed6-4688-9bf1-5b3c5c6fc99c	47fc8838-00ed-4d8c-a348-e77877703503	73	2026-09-29	4	Boa refeição e bem servida.	2026-09-29 13:28:32.933915-03
eb37fe57-5784-4fdd-ae59-818a8c937282	47fc8838-00ed-4d8c-a348-e77877703503	74	2026-09-29	5	Estava tudo muito gostoso.	2026-09-29 17:01:49.784154-03
f7815372-32a9-42e1-b50f-f119a857ca1e	47fc8838-00ed-4d8c-a348-e77877703503	75	2026-09-30	4	Estava muito saborosa.	2026-09-30 13:37:31.674176-03
24eeec6c-2222-460a-b954-cac8cc010480	47fc8838-00ed-4d8c-a348-e77877703503	76	2026-09-30	4	Boa refeição e bem servida.	2026-09-30 13:16:01.709171-03
36f0d765-4325-4a87-89bb-3a32c46cbcc6	47fc8838-00ed-4d8c-a348-e77877703503	77	2026-09-30	2	Achei a refeição abaixo do esperado.	2026-09-30 13:00:48.237223-03
7dc7fc4b-5ed4-4323-83c2-941570ea8b80	47fc8838-00ed-4d8c-a348-e77877703503	85	2026-10-05	3	Gostei, mas pode melhorar.	2026-10-05 17:21:28.983425-03
ffba4bfe-7e07-4ae7-a8ad-6211fbaa168a	47fc8838-00ed-4d8c-a348-e77877703503	86	2026-10-05	4	Gostei bastante da refeição.	2026-10-05 17:17:51.984961-03
0ecd280e-635a-41ff-8810-a8c936c3891f	47fc8838-00ed-4d8c-a348-e77877703503	87	2026-10-06	1	A refeição não estava agradável.	2026-10-06 18:41:12.70349-03
e2926a44-01dc-4d10-ac96-9aa43db5b294	47fc8838-00ed-4d8c-a348-e77877703503	88	2026-10-06	5	\N	2026-10-06 17:05:04.60779-03
f7f895e5-4683-4508-a23f-350c5f2c3b23	47fc8838-00ed-4d8c-a348-e77877703503	89	2026-10-06	5	Excelente refeição!	2026-10-06 18:54:05.891588-03
968acead-f285-4a33-84c5-2bd1b8350fd1	47fc8838-00ed-4d8c-a348-e77877703503	90	2026-10-07	4	Gostei bastante da refeição.	2026-10-07 13:40:48.447148-03
8177303d-0955-4a2b-a356-8d2c617a5be9	47fc8838-00ed-4d8c-a348-e77877703503	91	2026-10-07	5	Estava tudo muito gostoso.	2026-10-07 16:32:45.376757-03
3901e66b-8578-46e3-9f89-193b04efbf8e	47fc8838-00ed-4d8c-a348-e77877703503	92	2026-10-07	4	Boa refeição e bem servida.	2026-10-07 15:50:29.021922-03
edf75a3a-d301-40aa-981e-7198d752f4ba	47fc8838-00ed-4d8c-a348-e77877703503	93	2026-10-08	4	Boa refeição e bem servida.	2026-10-08 14:15:54.4185-03
015c887f-bc36-45cc-bcca-e5f434cf042f	47fc8838-00ed-4d8c-a348-e77877703503	58	2026-09-22	5	Excelente refeição!	2026-09-22 14:11:25.80607-03
bc9959b1-c09c-4e48-8fa4-5cc5aa05bc82	47fc8838-00ed-4d8c-a348-e77877703503	61	2026-09-23	4	Gostei bastante da refeição.	2026-09-23 13:14:41.513552-03
4008cc37-185a-4c64-9d13-8c725648b9b2	47fc8838-00ed-4d8c-a348-e77877703503	56	2026-09-21	1	O sabor poderia melhorar.	2026-09-21 18:04:40.927093-03
a3a43266-71c0-421d-a5eb-74a146669207	47fc8838-00ed-4d8c-a348-e77877703503	59	2026-09-22	1	\N	2026-09-22 16:36:21.883135-03
147690d5-e80b-4bc0-9f8d-bdb52a0a563b	47fc8838-00ed-4d8c-a348-e77877703503	62	2026-09-23	1	\N	2026-09-23 14:26:26.444588-03
87bb1875-aedc-42e7-a0ea-665d80a9da6f	47fc8838-00ed-4d8c-a348-e77877703503	63	2026-09-24	3	\N	2026-09-24 18:19:15.30518-03
970964ea-6f29-45d9-9c2e-ef8d14530869	47fc8838-00ed-4d8c-a348-e77877703503	94	2026-10-08	3	Estava boa no geral.	2026-10-08 15:09:34.073297-03
1819b423-355c-4454-a127-5945c5f0e81e	47fc8838-00ed-4d8c-a348-e77877703503	95	2026-10-08	3	\N	2026-10-08 16:37:40.798072-03
d790198e-a872-4fb0-9bb0-507ac54d8130	47fc8838-00ed-4d8c-a348-e77877703503	80	2026-10-01	5	Estava tudo muito gostoso.	2026-10-01 16:39:05.48276-03
0af403c5-2604-4d82-a718-12455763556a	47fc8838-00ed-4d8c-a348-e77877703503	81	2026-10-02	2	Achei a refeição abaixo do esperado.	2026-10-02 17:43:31.116139-03
b8482b84-609d-4118-ba09-215e9daa2e58	47fc8838-00ed-4d8c-a348-e77877703503	83	2026-10-02	4	Estava muito saborosa.	2026-10-02 18:19:09.823733-03
46fa121e-a398-457b-a9ac-7f915d0db736	47fc8838-00ed-4d8c-a348-e77877703503	84	2026-10-05	1	Não gostei da refeição.	2026-10-05 15:53:49.414641-03
c8200e18-ff2a-4efb-9133-5f5c2eb33aae	47fc8838-00ed-4d8c-a348-e77877703503	96	2026-10-09	2	A apresentação poderia melhorar.	2026-10-09 17:59:37.552408-03
c830991e-bea4-4cca-a21f-5ad2602d4fa2	47fc8838-00ed-4d8c-a348-e77877703503	97	2026-10-09	5	Estava tudo muito gostoso.	2026-10-09 15:08:16.216758-03
a2260476-c59d-4c8f-a043-f9d30225d468	47fc8838-00ed-4d8c-a348-e77877703503	98	2026-10-09	5	Estava tudo muito gostoso.	2026-10-09 18:17:56.401493-03
e09eb7b1-e809-4249-8e47-ab6fdc46f410	47fc8838-00ed-4d8c-a348-e77877703503	55	2026-09-21	4	\N	2026-09-21 17:55:06.848839-03
d2f0ee75-9e29-4953-86d6-6ecfe0f31a05	47fc8838-00ed-4d8c-a348-e77877703503	54	2026-09-21	3	Gostei, mas pode melhorar.	2026-09-21 13:03:42.582139-03
25e9225d-d173-48bf-a8ec-9d05a1bf0e19	47fc8838-00ed-4d8c-a348-e77877703503	60	2026-09-23	4	Estava muito saborosa.	2026-09-23 13:31:19.27001-03
cc80f8fb-e89c-4e57-9003-48eee6dbf232	47fc8838-00ed-4d8c-a348-e77877703503	57	2026-09-22	5	\N	2026-09-22 17:07:59.158129-03
6273ffb3-7186-47e0-bab5-ce00fbc895bb	47fc8838-00ed-4d8c-a348-e77877703503	78	2026-10-01	4	\N	2026-10-01 17:22:47.066879-03
80264364-df76-47a9-af9c-aeef51f7d206	47fc8838-00ed-4d8c-a348-e77877703503	79	2026-10-01	2	\N	2026-10-01 13:42:09.934379-03
2c80097a-b8aa-4139-964b-ad0acdaeef40	47fc8838-00ed-4d8c-a348-e77877703503	82	2026-10-02	5	\N	2026-10-02 18:33:55.638026-03
b8764139-474b-4298-b12d-cf9d34133d40	fce07bd2-0abe-49a2-af26-7508b7b6aea0	64	2026-09-24	1	O sabor poderia melhorar.	2026-09-24 16:24:53.997807-03
d2b1ad8c-ebf5-4847-b096-7a1d7e93e646	fce07bd2-0abe-49a2-af26-7508b7b6aea0	65	2026-09-24	5	\N	2026-09-24 17:29:47.654925-03
fb997504-fac7-4de2-af93-98626a0f7c8b	fce07bd2-0abe-49a2-af26-7508b7b6aea0	66	2026-09-25	3	Gostei, mas pode melhorar.	2026-09-25 15:22:10.665909-03
2bc2ad26-7352-4e33-a91a-7d3abfca624e	fce07bd2-0abe-49a2-af26-7508b7b6aea0	67	2026-09-25	3	Estava boa no geral.	2026-09-25 15:32:27.626082-03
c588b1ad-8855-4687-bf8a-e0314098a994	fce07bd2-0abe-49a2-af26-7508b7b6aea0	68	2026-09-25	4	\N	2026-09-25 16:26:08.080618-03
4f4abf1e-7510-4118-9f0e-c171b1ec1aed	fce07bd2-0abe-49a2-af26-7508b7b6aea0	69	2026-09-28	2	Poderia estar mais saborosa.	2026-09-28 16:48:16.916004-03
478ab9c0-8047-4ca7-88c6-36505ca31aad	fce07bd2-0abe-49a2-af26-7508b7b6aea0	70	2026-09-28	5	\N	2026-09-28 17:38:10.935754-03
b4bc9090-57db-49e5-bce8-c45959685b15	fce07bd2-0abe-49a2-af26-7508b7b6aea0	71	2026-09-28	1	\N	2026-09-28 15:31:29.560535-03
4a53d9a3-f30f-4234-859f-1bcf38975cf6	fce07bd2-0abe-49a2-af26-7508b7b6aea0	72	2026-09-29	3	A refeição estava razoável.	2026-09-29 16:43:55.526095-03
c5677e2e-d3da-456a-8997-66f3714e759b	fce07bd2-0abe-49a2-af26-7508b7b6aea0	73	2026-09-29	5	\N	2026-09-29 18:15:22.962111-03
9e096272-541c-4222-aed9-429a17d0a351	fce07bd2-0abe-49a2-af26-7508b7b6aea0	74	2026-09-29	4	\N	2026-09-29 15:42:12.358552-03
72d7aa86-5555-46e0-bfde-ff711974d053	fce07bd2-0abe-49a2-af26-7508b7b6aea0	75	2026-09-30	4	Estava muito saborosa.	2026-09-30 18:58:26.633624-03
4fa7e9f2-f9fc-4ca8-b5e0-1ba797ea1101	fce07bd2-0abe-49a2-af26-7508b7b6aea0	76	2026-09-30	4	Gostei bastante da refeição.	2026-09-30 15:44:17.392814-03
b7b84150-87f4-4de4-815c-6b777e8f052e	fce07bd2-0abe-49a2-af26-7508b7b6aea0	77	2026-09-30	1	O sabor poderia melhorar.	2026-09-30 17:17:43.099002-03
72c3fe6c-12a9-483f-980c-6572d6a9b467	fce07bd2-0abe-49a2-af26-7508b7b6aea0	85	2026-10-05	5	Excelente refeição!	2026-10-05 18:14:35.65452-03
5a75c0bc-c6fa-4e5f-86da-381c408ad1b0	fce07bd2-0abe-49a2-af26-7508b7b6aea0	86	2026-10-05	3	\N	2026-10-05 15:21:30.743555-03
68f0ed09-02c5-4e99-90f4-0f4b30f6bd57	fce07bd2-0abe-49a2-af26-7508b7b6aea0	87	2026-10-06	3	A refeição estava razoável.	2026-10-06 17:23:35.897042-03
e33d38c2-3115-4054-a378-ce38cad844bb	fce07bd2-0abe-49a2-af26-7508b7b6aea0	88	2026-10-06	3	Gostei, mas pode melhorar.	2026-10-06 14:24:18.1941-03
2396f827-5f50-4d59-a3d9-6926bc16cf38	fce07bd2-0abe-49a2-af26-7508b7b6aea0	89	2026-10-06	5	Estava tudo muito gostoso.	2026-10-06 13:37:50.837775-03
2d44d4b4-40b5-4409-a8c8-3f0d28f3c347	fce07bd2-0abe-49a2-af26-7508b7b6aea0	90	2026-10-07	4	\N	2026-10-07 16:00:58.082039-03
ca65ae70-b575-4ccc-98a3-095f1de7e142	fce07bd2-0abe-49a2-af26-7508b7b6aea0	91	2026-10-07	5	\N	2026-10-07 15:52:48.82987-03
e074b714-3896-45fe-9d7c-ce22724d7aae	fce07bd2-0abe-49a2-af26-7508b7b6aea0	92	2026-10-07	2	Achei a refeição abaixo do esperado.	2026-10-07 15:31:31.434015-03
0c03e4fb-a63a-4db8-a06e-8814f2c55f80	fce07bd2-0abe-49a2-af26-7508b7b6aea0	93	2026-10-08	4	Estava muito saborosa.	2026-10-08 16:25:39.106161-03
1f9835cf-fc2f-44a1-9f46-a4bb9432b2ce	fce07bd2-0abe-49a2-af26-7508b7b6aea0	58	2026-09-22	4	\N	2026-09-22 14:06:27.250416-03
b5b8ffe1-0329-46a0-955b-4aabd4968959	fce07bd2-0abe-49a2-af26-7508b7b6aea0	61	2026-09-23	4	Boa refeição e bem servida.	2026-09-23 17:02:26.225919-03
333d1125-c503-45bc-9a18-e76d909b8cd5	fce07bd2-0abe-49a2-af26-7508b7b6aea0	56	2026-09-21	4	Boa refeição e bem servida.	2026-09-21 14:53:41.236608-03
1bb2d348-4200-4847-ad6b-67f57daaae3e	fce07bd2-0abe-49a2-af26-7508b7b6aea0	59	2026-09-22	5	\N	2026-09-22 15:35:02.719219-03
a915ab8b-42de-4968-8077-5cc0b391866f	fce07bd2-0abe-49a2-af26-7508b7b6aea0	62	2026-09-23	4	Boa refeição e bem servida.	2026-09-23 13:53:32.93529-03
e1a867c1-5213-4824-b488-59deedc53880	fce07bd2-0abe-49a2-af26-7508b7b6aea0	63	2026-09-24	3	Estava boa no geral.	2026-09-24 17:09:40.484981-03
29240e6b-2d45-4048-8441-b4d4294c1b08	fce07bd2-0abe-49a2-af26-7508b7b6aea0	94	2026-10-08	5	\N	2026-10-08 18:48:41.717146-03
5175f6eb-3f89-4057-a2d7-bd44ba312384	fce07bd2-0abe-49a2-af26-7508b7b6aea0	95	2026-10-08	5	Estava tudo muito gostoso.	2026-10-08 16:31:41.241888-03
417841da-0cf6-4be5-8bea-0d8cef55a71d	fce07bd2-0abe-49a2-af26-7508b7b6aea0	80	2026-10-01	3	Gostei, mas pode melhorar.	2026-10-01 15:05:52.301522-03
384c77df-d415-4f85-9bea-3c35f5ddf334	fce07bd2-0abe-49a2-af26-7508b7b6aea0	81	2026-10-02	5	Adorei o cardápio de hoje!	2026-10-02 13:19:27.634183-03
959f7aa2-e3fd-4acf-aec9-2c250903eeb1	fce07bd2-0abe-49a2-af26-7508b7b6aea0	83	2026-10-02	5	Estava tudo muito gostoso.	2026-10-02 16:21:58.452942-03
a17e0bbf-8d37-40e2-91c6-0724f851e431	fce07bd2-0abe-49a2-af26-7508b7b6aea0	84	2026-10-05	5	Adorei o cardápio de hoje!	2026-10-05 18:21:26.235944-03
4ed7829d-85f5-4514-90f9-23d6a2b7c864	fce07bd2-0abe-49a2-af26-7508b7b6aea0	96	2026-10-09	4	Gostei bastante da refeição.	2026-10-09 15:54:54.715171-03
f1da453c-1120-482f-8060-c46cf54a7430	fce07bd2-0abe-49a2-af26-7508b7b6aea0	97	2026-10-09	5	Excelente refeição!	2026-10-09 14:13:10.109074-03
1566190f-f553-45eb-8ace-90a943a06dce	fce07bd2-0abe-49a2-af26-7508b7b6aea0	98	2026-10-09	4	\N	2026-10-09 17:57:54.842422-03
d4546d48-b576-494e-b1c1-6b6c420d2720	fce07bd2-0abe-49a2-af26-7508b7b6aea0	55	2026-09-21	4	Boa refeição e bem servida.	2026-09-21 13:45:59.475591-03
3925e5ec-0a08-4fbf-8bb6-6a35409fc865	fce07bd2-0abe-49a2-af26-7508b7b6aea0	54	2026-09-21	2	A apresentação poderia melhorar.	2026-09-21 17:59:23.817255-03
8d52492f-1150-4614-a281-1e2e34f238bf	fce07bd2-0abe-49a2-af26-7508b7b6aea0	60	2026-09-23	4	\N	2026-09-23 17:46:50.4874-03
e7bd1633-3ab0-4f5c-ba6a-20c44b2e9f32	fce07bd2-0abe-49a2-af26-7508b7b6aea0	57	2026-09-22	4	\N	2026-09-22 18:49:43.229589-03
8be5bfad-3c3f-4d36-ab66-e1cee2b7f2da	fce07bd2-0abe-49a2-af26-7508b7b6aea0	78	2026-10-01	4	Gostei bastante da refeição.	2026-10-01 17:03:30.602283-03
853085e6-ea21-4904-ade9-6fa3e4a6825d	fce07bd2-0abe-49a2-af26-7508b7b6aea0	79	2026-10-01	5	Excelente refeição!	2026-10-01 13:12:22.879108-03
88c68839-dc6d-4888-b664-0f9cad4bab59	fce07bd2-0abe-49a2-af26-7508b7b6aea0	82	2026-10-02	2	Poderia estar mais saborosa.	2026-10-02 14:13:35.295667-03
ffcd5023-673b-44e1-9946-a8221c840286	da593bba-f6eb-4d54-b83a-e05554d9dff0	64	2026-09-24	1	O sabor poderia melhorar.	2026-09-24 15:14:58.134174-03
7f41f6c3-fde6-4f7f-8a28-149da365636f	da593bba-f6eb-4d54-b83a-e05554d9dff0	65	2026-09-24	3	A refeição estava razoável.	2026-09-24 18:32:32.862432-03
feab77d0-6da5-4f32-9caf-679a17968f56	da593bba-f6eb-4d54-b83a-e05554d9dff0	66	2026-09-25	3	\N	2026-09-25 17:27:25.513685-03
c3d8b03f-b061-4edd-aeec-41705785009e	da593bba-f6eb-4d54-b83a-e05554d9dff0	67	2026-09-25	3	A refeição estava razoável.	2026-09-25 15:56:14.322097-03
a1712dd5-dddf-4126-85d7-3639558aee15	da593bba-f6eb-4d54-b83a-e05554d9dff0	68	2026-09-25	5	\N	2026-09-25 18:59:55.999418-03
5ab99829-0096-4a63-8ab0-639c2886d0e2	da593bba-f6eb-4d54-b83a-e05554d9dff0	69	2026-09-28	5	Adorei o cardápio de hoje!	2026-09-28 17:47:38.64226-03
40b1880f-c573-4814-8b6c-0b5ad3ad17e3	da593bba-f6eb-4d54-b83a-e05554d9dff0	70	2026-09-28	3	A refeição estava razoável.	2026-09-28 18:27:27.36958-03
aee9bc3a-2a58-4463-a568-27ea0097adf1	da593bba-f6eb-4d54-b83a-e05554d9dff0	71	2026-09-28	5	\N	2026-09-28 13:56:36.733772-03
dc035a50-af76-437c-828c-712c528f135b	da593bba-f6eb-4d54-b83a-e05554d9dff0	72	2026-09-29	5	Excelente refeição!	2026-09-29 14:58:31.773061-03
ae354cdc-247b-42dd-85cd-03e9a552f47f	da593bba-f6eb-4d54-b83a-e05554d9dff0	73	2026-09-29	5	Excelente refeição!	2026-09-29 14:47:06.862944-03
fd3e5ac5-a093-4fdd-9e8f-31e5dcd5fc2b	da593bba-f6eb-4d54-b83a-e05554d9dff0	74	2026-09-29	5	\N	2026-09-29 14:59:06.924002-03
14b64799-5d94-49b1-9382-9d3cf6ad71c6	da593bba-f6eb-4d54-b83a-e05554d9dff0	75	2026-09-30	4	\N	2026-09-30 17:36:08.561223-03
5ea22dc4-6bf2-4ee7-a237-d0e86b5ecf68	da593bba-f6eb-4d54-b83a-e05554d9dff0	76	2026-09-30	4	Gostei bastante da refeição.	2026-09-30 14:45:05.19688-03
899f0ca7-a636-4a4e-926a-c7f4279703df	da593bba-f6eb-4d54-b83a-e05554d9dff0	77	2026-09-30	2	Achei a refeição abaixo do esperado.	2026-09-30 18:59:24.629133-03
9b15a27b-491a-41ce-b1ad-c2c10c85b242	da593bba-f6eb-4d54-b83a-e05554d9dff0	85	2026-10-05	1	Não gostei da refeição.	2026-10-05 16:13:50.982295-03
a49a74bf-4577-44c7-8f67-774e481b4679	da593bba-f6eb-4d54-b83a-e05554d9dff0	86	2026-10-05	3	Estava boa no geral.	2026-10-05 18:12:53.143324-03
2276895b-c440-49ac-bb32-b52055069233	da593bba-f6eb-4d54-b83a-e05554d9dff0	87	2026-10-06	5	Estava tudo muito gostoso.	2026-10-06 15:53:29.32675-03
0c48c325-f469-4ab4-894e-6ed0df0f4bae	da593bba-f6eb-4d54-b83a-e05554d9dff0	88	2026-10-06	3	A refeição estava razoável.	2026-10-06 14:43:54.786068-03
3dc12f7a-074d-485f-8a25-54868057ced7	da593bba-f6eb-4d54-b83a-e05554d9dff0	89	2026-10-06	4	Estava muito saborosa.	2026-10-06 13:31:06.851808-03
2ced59ca-3496-435e-9bf7-2d6ee56714ec	da593bba-f6eb-4d54-b83a-e05554d9dff0	90	2026-10-07	4	Estava muito saborosa.	2026-10-07 16:40:51.271669-03
06eddd6e-e7f0-4f28-a426-ae429a77a474	da593bba-f6eb-4d54-b83a-e05554d9dff0	91	2026-10-07	5	Adorei o cardápio de hoje!	2026-10-07 14:22:01.591136-03
cb05e543-7a3e-42c7-a9df-f834a9759c16	da593bba-f6eb-4d54-b83a-e05554d9dff0	92	2026-10-07	5	Excelente refeição!	2026-10-07 15:12:32.707899-03
054dfeab-e411-453f-afc4-66c54bd9101f	da593bba-f6eb-4d54-b83a-e05554d9dff0	93	2026-10-08	2	Poderia estar mais saborosa.	2026-10-08 15:25:19.110588-03
146736e0-9287-4c92-893c-30a1d7b5c46b	da593bba-f6eb-4d54-b83a-e05554d9dff0	58	2026-09-22	2	Achei a refeição abaixo do esperado.	2026-09-22 16:53:54.716879-03
8ebd9073-6ba8-433c-98eb-26dd1f57e857	da593bba-f6eb-4d54-b83a-e05554d9dff0	61	2026-09-23	4	\N	2026-09-23 14:42:10.21868-03
2729c5da-018a-496d-bc73-da76b125a958	da593bba-f6eb-4d54-b83a-e05554d9dff0	56	2026-09-21	3	Gostei, mas pode melhorar.	2026-09-21 13:02:09.744156-03
d9f0884c-f5a7-4324-91ec-a757e7809d94	da593bba-f6eb-4d54-b83a-e05554d9dff0	59	2026-09-22	2	A apresentação poderia melhorar.	2026-09-22 17:06:17.105991-03
69f8f947-f3a7-4912-b946-5dd862e66b48	da593bba-f6eb-4d54-b83a-e05554d9dff0	62	2026-09-23	5	Excelente refeição!	2026-09-23 16:02:06.262095-03
72e2cb1e-4f10-480f-8ed0-3423bbddf0c0	da593bba-f6eb-4d54-b83a-e05554d9dff0	63	2026-09-24	3	\N	2026-09-24 16:19:00.389008-03
833bdfca-ac02-4686-94b7-b80336684bfa	da593bba-f6eb-4d54-b83a-e05554d9dff0	94	2026-10-08	4	Boa refeição e bem servida.	2026-10-08 14:05:35.863558-03
9b331f4a-5f4b-4fe2-aec8-01ccff246379	da593bba-f6eb-4d54-b83a-e05554d9dff0	95	2026-10-08	5	Estava tudo muito gostoso.	2026-10-08 14:15:12.555979-03
ab7bda4a-975d-4e63-a743-8985e1eab593	da593bba-f6eb-4d54-b83a-e05554d9dff0	80	2026-10-01	5	Adorei o cardápio de hoje!	2026-10-01 14:34:17.21574-03
c1386e6c-aab6-4510-9063-204a52f9441f	da593bba-f6eb-4d54-b83a-e05554d9dff0	81	2026-10-02	5	\N	2026-10-02 17:59:41.933543-03
fb93654f-2a6d-4db9-a39c-42607e91a072	da593bba-f6eb-4d54-b83a-e05554d9dff0	83	2026-10-02	5	Estava tudo muito gostoso.	2026-10-02 16:04:14.815513-03
c5284bd8-9e58-48b2-bfb1-6830b1f011e8	da593bba-f6eb-4d54-b83a-e05554d9dff0	84	2026-10-05	4	Gostei bastante da refeição.	2026-10-05 16:05:49.347333-03
fea47a3e-4db0-4d34-9e34-87a5caf4eb55	da593bba-f6eb-4d54-b83a-e05554d9dff0	96	2026-10-09	5	Excelente refeição!	2026-10-09 16:19:35.04238-03
e5a350e8-e82e-48f9-b822-ad19686b02da	da593bba-f6eb-4d54-b83a-e05554d9dff0	97	2026-10-09	5	Excelente refeição!	2026-10-09 15:38:11.702645-03
97b140e5-d1bf-410a-b144-a575aa0ecbe0	da593bba-f6eb-4d54-b83a-e05554d9dff0	98	2026-10-09	4	Estava muito saborosa.	2026-10-09 14:10:37.868542-03
17202c73-4b58-4a01-b80a-7a1328f83964	da593bba-f6eb-4d54-b83a-e05554d9dff0	55	2026-09-21	5	Adorei o cardápio de hoje!	2026-09-21 15:22:16.613178-03
267b3135-b7dd-4ead-9443-96626cddd837	da593bba-f6eb-4d54-b83a-e05554d9dff0	54	2026-09-21	5	Estava tudo muito gostoso.	2026-09-21 18:29:55.537579-03
b9b42aa0-44b2-4857-af2a-88a88d994f02	da593bba-f6eb-4d54-b83a-e05554d9dff0	60	2026-09-23	4	\N	2026-09-23 15:26:00.53535-03
eddfbb0c-08f9-4fb4-be74-c8d2a9af7e2b	da593bba-f6eb-4d54-b83a-e05554d9dff0	57	2026-09-22	4	Estava muito saborosa.	2026-09-22 14:09:54.024276-03
8ee56315-f4e6-45c9-a242-f54f345f95e7	da593bba-f6eb-4d54-b83a-e05554d9dff0	78	2026-10-01	5	Excelente refeição!	2026-10-01 13:30:44.683553-03
7395c816-7b1e-47e9-a32f-98bfb7c8369c	da593bba-f6eb-4d54-b83a-e05554d9dff0	79	2026-10-01	1	O sabor poderia melhorar.	2026-10-01 14:43:43.76351-03
d6c4d05f-aeac-4b27-b6f1-11b1dc5d8a9e	da593bba-f6eb-4d54-b83a-e05554d9dff0	82	2026-10-02	4	Boa refeição e bem servida.	2026-10-02 13:37:50.953591-03
8f444752-5d40-4c67-baa2-8570b3937f83	71800530-dbb1-4f13-ad9a-350c4c866ab6	64	2026-09-24	4	Estava muito saborosa.	2026-09-24 18:13:27.589172-03
f30ad3b0-9309-4c2d-b61b-75d6c5a69d07	71800530-dbb1-4f13-ad9a-350c4c866ab6	65	2026-09-24	5	Excelente refeição!	2026-09-24 18:59:48.305204-03
f0091c72-b580-45fd-9642-998fda1fcc51	71800530-dbb1-4f13-ad9a-350c4c866ab6	66	2026-09-25	4	Boa refeição e bem servida.	2026-09-25 13:04:52.540362-03
80c78c83-79ff-499c-a49d-9be9da066b1a	71800530-dbb1-4f13-ad9a-350c4c866ab6	67	2026-09-25	1	\N	2026-09-25 16:28:31.319474-03
972aff59-a927-4684-932c-4067e5230325	71800530-dbb1-4f13-ad9a-350c4c866ab6	68	2026-09-25	4	Gostei bastante da refeição.	2026-09-25 13:09:12.157768-03
715b37ae-34bc-48f5-a4b2-495fc24d7f65	71800530-dbb1-4f13-ad9a-350c4c866ab6	69	2026-09-28	5	Adorei o cardápio de hoje!	2026-09-28 14:39:17.472684-03
403ef846-e0af-4de0-b3eb-39826061f2df	71800530-dbb1-4f13-ad9a-350c4c866ab6	70	2026-09-28	3	\N	2026-09-28 18:21:40.175746-03
953cf591-6eab-475e-ac57-2d7249894c6f	71800530-dbb1-4f13-ad9a-350c4c866ab6	71	2026-09-28	3	A refeição estava razoável.	2026-09-28 16:47:21.160038-03
596f6304-8d0b-4bd2-a50b-517b7506abfc	71800530-dbb1-4f13-ad9a-350c4c866ab6	72	2026-09-29	4	Boa refeição e bem servida.	2026-09-29 14:46:30.860778-03
ff0b0c95-21b3-4e5a-87e2-f3b27007a7a5	71800530-dbb1-4f13-ad9a-350c4c866ab6	73	2026-09-29	3	Estava boa no geral.	2026-09-29 13:15:28.472709-03
4e8fdfdd-592d-480b-899c-e726595ecc63	71800530-dbb1-4f13-ad9a-350c4c866ab6	74	2026-09-29	2	A apresentação poderia melhorar.	2026-09-29 15:09:00.005751-03
a784aa81-4b24-4626-b85d-01dd19be9f8b	71800530-dbb1-4f13-ad9a-350c4c866ab6	75	2026-09-30	3	Gostei, mas pode melhorar.	2026-09-30 16:09:47.860062-03
12d0e978-852f-463e-8710-dc0876dc8d19	71800530-dbb1-4f13-ad9a-350c4c866ab6	76	2026-09-30	5	Excelente refeição!	2026-09-30 16:54:09.740378-03
0e3bf03e-ba6d-43a0-ba07-31385ff1c3ac	71800530-dbb1-4f13-ad9a-350c4c866ab6	77	2026-09-30	2	Poderia estar mais saborosa.	2026-09-30 16:25:09.636156-03
7982f26d-201b-4e3e-88c5-089635f50816	71800530-dbb1-4f13-ad9a-350c4c866ab6	85	2026-10-05	3	Gostei, mas pode melhorar.	2026-10-05 14:16:14.77264-03
a7e39a1c-1a33-4cfa-abd5-5ff14179458a	71800530-dbb1-4f13-ad9a-350c4c866ab6	86	2026-10-05	5	Estava tudo muito gostoso.	2026-10-05 17:01:34.716505-03
ac4baa0c-e047-4f9e-b928-7b2039788013	71800530-dbb1-4f13-ad9a-350c4c866ab6	87	2026-10-06	5	\N	2026-10-06 18:27:40.636071-03
766e311b-ac2a-4862-bd68-e372e6320a21	71800530-dbb1-4f13-ad9a-350c4c866ab6	88	2026-10-06	4	\N	2026-10-06 17:53:17.111303-03
77d4dbe7-868b-4a07-90ed-4d3e6ba7aaeb	71800530-dbb1-4f13-ad9a-350c4c866ab6	89	2026-10-06	1	A refeição não estava agradável.	2026-10-06 17:55:56.676134-03
855195e1-5154-4df3-bae6-ce793956508d	71800530-dbb1-4f13-ad9a-350c4c866ab6	90	2026-10-07	3	Estava boa no geral.	2026-10-07 15:24:26.391165-03
f16fc45a-49a7-41dd-b0ba-48ac793b8282	71800530-dbb1-4f13-ad9a-350c4c866ab6	91	2026-10-07	1	Não gostei da refeição.	2026-10-07 13:48:38.634987-03
1199babd-a522-469f-89a2-77422d3aadb9	71800530-dbb1-4f13-ad9a-350c4c866ab6	92	2026-10-07	4	Gostei bastante da refeição.	2026-10-07 17:11:57.054312-03
0ee5fdeb-8ca6-430e-b85c-760c740fc286	71800530-dbb1-4f13-ad9a-350c4c866ab6	93	2026-10-08	5	Excelente refeição!	2026-10-08 13:43:35.613526-03
8de8cc5e-f4e6-4c89-b007-59e7da14db43	71800530-dbb1-4f13-ad9a-350c4c866ab6	58	2026-09-22	4	Gostei bastante da refeição.	2026-09-22 17:18:26.017812-03
65e3aec2-045d-49ff-b94d-bcf2f534de4f	71800530-dbb1-4f13-ad9a-350c4c866ab6	61	2026-09-23	5	Excelente refeição!	2026-09-23 18:30:41.168896-03
e8a83052-ed21-409a-a296-a67642d98cc8	71800530-dbb1-4f13-ad9a-350c4c866ab6	56	2026-09-21	5	\N	2026-09-21 16:46:38.569599-03
4caf5f20-2a8e-4011-bc05-419e77d0dfa3	71800530-dbb1-4f13-ad9a-350c4c866ab6	59	2026-09-22	5	Estava tudo muito gostoso.	2026-09-22 18:10:11.567199-03
ad1cc10f-c07c-4f6a-8e18-9ac526adecc0	71800530-dbb1-4f13-ad9a-350c4c866ab6	62	2026-09-23	3	A refeição estava razoável.	2026-09-23 16:04:12.189791-03
9cf10681-00e0-44b6-91fc-c9294e85f108	71800530-dbb1-4f13-ad9a-350c4c866ab6	63	2026-09-24	4	\N	2026-09-24 17:43:38.6612-03
4b27d9c0-71cf-484f-a7c6-7da54d89d427	71800530-dbb1-4f13-ad9a-350c4c866ab6	94	2026-10-08	5	\N	2026-10-08 18:18:09.707978-03
52f719be-3132-419d-b7f5-3dbbc440744b	71800530-dbb1-4f13-ad9a-350c4c866ab6	95	2026-10-08	4	\N	2026-10-08 17:18:58.957846-03
195700c2-7bfe-49e9-8025-d5f710de4da2	71800530-dbb1-4f13-ad9a-350c4c866ab6	80	2026-10-01	5	\N	2026-10-01 15:28:12.104888-03
f60a808b-8db2-457c-949f-36dda6500cd2	71800530-dbb1-4f13-ad9a-350c4c866ab6	81	2026-10-02	4	\N	2026-10-02 14:58:16.429653-03
48e819dd-39d8-4793-9391-21f132cbe1da	71800530-dbb1-4f13-ad9a-350c4c866ab6	83	2026-10-02	4	Gostei bastante da refeição.	2026-10-02 15:48:24.724486-03
78744051-21cc-4853-81d4-d80688ab42ef	71800530-dbb1-4f13-ad9a-350c4c866ab6	84	2026-10-05	3	Gostei, mas pode melhorar.	2026-10-05 16:30:42.558558-03
ba80d016-97d8-43db-bf5a-ab38846dc1d8	71800530-dbb1-4f13-ad9a-350c4c866ab6	96	2026-10-09	4	Gostei bastante da refeição.	2026-10-09 15:11:18.207768-03
ec008373-8b53-4611-8ad5-96663ca6620e	71800530-dbb1-4f13-ad9a-350c4c866ab6	97	2026-10-09	5	Estava tudo muito gostoso.	2026-10-09 16:36:34.573635-03
e8b89890-3ae4-4ec4-9742-fcc5e8182a27	71800530-dbb1-4f13-ad9a-350c4c866ab6	98	2026-10-09	5	\N	2026-10-09 13:13:34.724156-03
530eb64e-80fc-49a7-9a7b-31e8f63f28f9	71800530-dbb1-4f13-ad9a-350c4c866ab6	55	2026-09-21	4	Estava muito saborosa.	2026-09-21 13:02:26.418416-03
70207e6e-61d8-4bf0-94c2-01c1e3281182	71800530-dbb1-4f13-ad9a-350c4c866ab6	54	2026-09-21	2	\N	2026-09-21 15:53:12.822379-03
a249668d-a9f6-44a0-b1e0-5c03934c65a1	71800530-dbb1-4f13-ad9a-350c4c866ab6	60	2026-09-23	4	Gostei bastante da refeição.	2026-09-23 14:18:46.070387-03
5d1cdbb7-5245-4b46-be51-9b65a47f6334	71800530-dbb1-4f13-ad9a-350c4c866ab6	57	2026-09-22	4	Estava muito saborosa.	2026-09-22 15:05:56.787621-03
3ff6e853-46b8-4e77-849b-c1a5a4aa7e0b	71800530-dbb1-4f13-ad9a-350c4c866ab6	78	2026-10-01	5	Excelente refeição!	2026-10-01 15:07:32.119331-03
13e57166-e479-4999-9579-2938e409b229	71800530-dbb1-4f13-ad9a-350c4c866ab6	79	2026-10-01	1	O sabor poderia melhorar.	2026-10-01 16:46:48.702095-03
3893b811-e6e4-4719-9eee-9eefe7079e1d	71800530-dbb1-4f13-ad9a-350c4c866ab6	82	2026-10-02	4	Estava muito saborosa.	2026-10-02 18:28:34.591521-03
04a0f759-b905-4806-8b48-25340a6d71c5	335edd30-bd49-421b-9b2e-bec9512fa23f	64	2026-09-24	5	\N	2026-09-24 18:17:54.396988-03
5ac29713-5524-47e8-a1c3-3c735d532312	335edd30-bd49-421b-9b2e-bec9512fa23f	65	2026-09-24	5	Estava tudo muito gostoso.	2026-09-24 13:22:56.632594-03
3e62e9a9-bdf6-4d3e-939d-5fc7a85eca79	335edd30-bd49-421b-9b2e-bec9512fa23f	66	2026-09-25	4	Boa refeição e bem servida.	2026-09-25 14:53:33.020994-03
73da6019-bc37-4ca3-8e29-0df4bd5431d9	335edd30-bd49-421b-9b2e-bec9512fa23f	67	2026-09-25	5	Adorei o cardápio de hoje!	2026-09-25 17:41:11.838306-03
9e168499-15fe-4ea5-b823-baee96ed513d	335edd30-bd49-421b-9b2e-bec9512fa23f	68	2026-09-25	5	\N	2026-09-25 15:22:18.996028-03
2c73dca8-2151-42c1-a7ed-2666b44f56c3	335edd30-bd49-421b-9b2e-bec9512fa23f	69	2026-09-28	3	\N	2026-09-28 13:25:50.195014-03
5d3daa3e-c97e-44da-96c3-0c6f2db0ec97	335edd30-bd49-421b-9b2e-bec9512fa23f	70	2026-09-28	1	O sabor poderia melhorar.	2026-09-28 14:55:18.147632-03
2342625c-4f47-47af-8c4c-71583b0b7daa	335edd30-bd49-421b-9b2e-bec9512fa23f	71	2026-09-28	1	Não gostei da refeição.	2026-09-28 13:04:35.330565-03
b2f051f0-2e1d-42af-91b5-d18e333ef29d	335edd30-bd49-421b-9b2e-bec9512fa23f	72	2026-09-29	4	Estava muito saborosa.	2026-09-29 18:49:16.168476-03
11aca2c0-9810-40bb-a8db-feb241d2e2ac	335edd30-bd49-421b-9b2e-bec9512fa23f	73	2026-09-29	5	Adorei o cardápio de hoje!	2026-09-29 15:33:27.756358-03
510c8359-181d-41a7-9a77-e309e4131f64	335edd30-bd49-421b-9b2e-bec9512fa23f	74	2026-09-29	3	Estava boa no geral.	2026-09-29 13:04:03.532801-03
83e4e5bb-9869-4ad7-9cfe-007af3239186	335edd30-bd49-421b-9b2e-bec9512fa23f	75	2026-09-30	5	Excelente refeição!	2026-09-30 15:34:52.324506-03
fad8f7f6-b6d8-4c01-9624-14be05b025a0	335edd30-bd49-421b-9b2e-bec9512fa23f	76	2026-09-30	1	\N	2026-09-30 17:19:03.524563-03
9f1c7e8b-999c-48a3-8832-518a5489e7ce	335edd30-bd49-421b-9b2e-bec9512fa23f	77	2026-09-30	1	A refeição não estava agradável.	2026-09-30 14:09:52.318501-03
67bfef71-d00a-477c-99e3-bbe9cb824416	335edd30-bd49-421b-9b2e-bec9512fa23f	85	2026-10-05	4	Gostei bastante da refeição.	2026-10-05 13:20:27.090636-03
a0009333-cd50-4447-aa5f-067be4eaa383	335edd30-bd49-421b-9b2e-bec9512fa23f	86	2026-10-05	4	Gostei bastante da refeição.	2026-10-05 18:08:50.795573-03
e188606f-61a6-4d3c-957f-cd4fc77bc02c	335edd30-bd49-421b-9b2e-bec9512fa23f	87	2026-10-06	5	Excelente refeição!	2026-10-06 16:06:55.104544-03
ddf91557-e84e-4e2e-a7a9-be1e334722ea	335edd30-bd49-421b-9b2e-bec9512fa23f	88	2026-10-06	3	Gostei, mas pode melhorar.	2026-10-06 17:56:26.001251-03
eb005026-5ac2-4d76-853b-999996a2e0bc	335edd30-bd49-421b-9b2e-bec9512fa23f	89	2026-10-06	4	\N	2026-10-06 13:42:31.899121-03
3ff70151-46c3-4ea6-a399-467250993223	335edd30-bd49-421b-9b2e-bec9512fa23f	90	2026-10-07	5	\N	2026-10-07 13:47:19.649016-03
adae040b-52e7-422e-98e5-6d7ea0824275	335edd30-bd49-421b-9b2e-bec9512fa23f	91	2026-10-07	2	A apresentação poderia melhorar.	2026-10-07 14:02:14.506332-03
9f21fafe-39fa-42cb-a887-996ef8aff1f2	335edd30-bd49-421b-9b2e-bec9512fa23f	92	2026-10-07	3	Estava boa no geral.	2026-10-07 15:28:56.472658-03
5e2d8b46-22bf-4138-ba5a-bc125ba59e5f	335edd30-bd49-421b-9b2e-bec9512fa23f	93	2026-10-08	1	A refeição não estava agradável.	2026-10-08 17:02:21.01233-03
fdfa0d6e-fdab-4dfb-9e8b-ffc5c0ecf081	335edd30-bd49-421b-9b2e-bec9512fa23f	58	2026-09-22	1	O sabor poderia melhorar.	2026-09-22 13:23:28.109783-03
27c8d4bc-6f3a-4ad3-89a1-2bc2bffc2452	335edd30-bd49-421b-9b2e-bec9512fa23f	61	2026-09-23	1	O sabor poderia melhorar.	2026-09-23 15:43:57.00193-03
c2a10599-29ef-4cfd-9a8b-89058e5b595a	335edd30-bd49-421b-9b2e-bec9512fa23f	56	2026-09-21	4	Gostei bastante da refeição.	2026-09-21 16:45:14.446076-03
1a3da3e4-ea09-4536-a47f-3e63cf4c699a	335edd30-bd49-421b-9b2e-bec9512fa23f	59	2026-09-22	3	A refeição estava razoável.	2026-09-22 18:42:49.336548-03
7664ddcf-f7c1-40fc-8ad3-f83b781ee58d	335edd30-bd49-421b-9b2e-bec9512fa23f	62	2026-09-23	5	Excelente refeição!	2026-09-23 18:51:57.03438-03
7f884c55-eec9-46ba-9e38-de4e19274deb	335edd30-bd49-421b-9b2e-bec9512fa23f	63	2026-09-24	4	Gostei bastante da refeição.	2026-09-24 16:21:29.182798-03
4b2d6124-ba8b-457a-849e-8569edd60365	335edd30-bd49-421b-9b2e-bec9512fa23f	94	2026-10-08	4	Boa refeição e bem servida.	2026-10-08 13:40:12.310208-03
bb9a1873-be8a-4a65-86b2-4cad33ed745c	335edd30-bd49-421b-9b2e-bec9512fa23f	95	2026-10-08	3	\N	2026-10-08 18:19:26.037086-03
77364912-b2ff-4b4c-9d88-49936555cb0f	335edd30-bd49-421b-9b2e-bec9512fa23f	80	2026-10-01	1	Não gostei da refeição.	2026-10-01 16:11:12.04589-03
ae33c6b3-755e-47ac-8d4a-00fa85559448	335edd30-bd49-421b-9b2e-bec9512fa23f	81	2026-10-02	5	Excelente refeição!	2026-10-02 16:10:18.599019-03
0361b815-e5b0-4926-8005-fdb2bfeab009	335edd30-bd49-421b-9b2e-bec9512fa23f	83	2026-10-02	2	A apresentação poderia melhorar.	2026-10-02 17:32:04.335166-03
93354d6f-9912-4a3b-9995-0262a5edf609	335edd30-bd49-421b-9b2e-bec9512fa23f	84	2026-10-05	1	Não gostei da refeição.	2026-10-05 17:57:02.36551-03
49d5250b-aba8-4d65-9608-a213a03dd91d	335edd30-bd49-421b-9b2e-bec9512fa23f	96	2026-10-09	3	Gostei, mas pode melhorar.	2026-10-09 16:45:46.135611-03
01d3acf0-cb6c-4059-aa72-aacbad6c10c5	335edd30-bd49-421b-9b2e-bec9512fa23f	97	2026-10-09	3	\N	2026-10-09 15:41:27.352387-03
73f9b534-f9bf-40ad-a0c2-c0d69f0aee58	335edd30-bd49-421b-9b2e-bec9512fa23f	98	2026-10-09	2	\N	2026-10-09 13:55:17.604713-03
c45fe7a8-f7a3-42d4-80d2-bdf65292c160	335edd30-bd49-421b-9b2e-bec9512fa23f	55	2026-09-21	2	Achei a refeição abaixo do esperado.	2026-09-21 13:34:25.454871-03
c7aef166-a1a2-4528-a6fb-f2e31cd459c7	335edd30-bd49-421b-9b2e-bec9512fa23f	54	2026-09-21	5	Estava tudo muito gostoso.	2026-09-21 13:25:04.285584-03
4bfbc4fd-a109-41e9-8dad-b67ca1d3e1a3	335edd30-bd49-421b-9b2e-bec9512fa23f	60	2026-09-23	3	\N	2026-09-23 18:21:48.868212-03
789135f5-2710-4847-86ea-abc12f35fe60	335edd30-bd49-421b-9b2e-bec9512fa23f	57	2026-09-22	4	Estava muito saborosa.	2026-09-22 13:18:17.055756-03
bd145d96-aba5-4560-bdff-c99dd6f3e8c0	335edd30-bd49-421b-9b2e-bec9512fa23f	78	2026-10-01	3	Gostei, mas pode melhorar.	2026-10-01 16:10:18.214567-03
dad9d15b-a821-4906-8515-f7ebaa1058cd	335edd30-bd49-421b-9b2e-bec9512fa23f	79	2026-10-01	5	\N	2026-10-01 16:04:58.693004-03
5abfe14f-8a8a-44f7-a690-a9def8141e44	335edd30-bd49-421b-9b2e-bec9512fa23f	82	2026-10-02	5	Estava tudo muito gostoso.	2026-10-02 16:45:51.146395-03
4b2fa6d1-15f5-4573-81ac-50007fd74a62	c36f016a-fbc7-45cf-a547-ba989672d072	64	2026-09-24	4	\N	2026-09-24 17:56:37.942968-03
a6e8813a-8ece-4ef8-b6b7-4031d5a2c3f6	c36f016a-fbc7-45cf-a547-ba989672d072	65	2026-09-24	1	A refeição não estava agradável.	2026-09-24 17:22:55.009335-03
a4931f8f-9402-4922-be7a-4d0aa3aed50e	c36f016a-fbc7-45cf-a547-ba989672d072	66	2026-09-25	3	Gostei, mas pode melhorar.	2026-09-25 15:16:22.969261-03
02e8a1d5-53bb-4645-8567-6414b9e41e53	c36f016a-fbc7-45cf-a547-ba989672d072	67	2026-09-25	3	A refeição estava razoável.	2026-09-25 15:23:24.646744-03
a54d49b8-9ceb-43ee-ae40-f5b366eb0033	c36f016a-fbc7-45cf-a547-ba989672d072	68	2026-09-25	1	A refeição não estava agradável.	2026-09-25 17:11:28.639578-03
3d953d9f-d669-4081-b6d1-6ec12b313cd5	c36f016a-fbc7-45cf-a547-ba989672d072	69	2026-09-28	5	Estava tudo muito gostoso.	2026-09-28 18:00:54.171352-03
b6af2149-fcdd-4c4a-8943-9b58e22a76eb	c36f016a-fbc7-45cf-a547-ba989672d072	70	2026-09-28	3	\N	2026-09-28 15:49:22.634994-03
a712f201-8038-4c44-8852-c7dd85c3ef66	c36f016a-fbc7-45cf-a547-ba989672d072	71	2026-09-28	5	Adorei o cardápio de hoje!	2026-09-28 16:21:03.620819-03
d3d7af29-f65e-46a2-a1f1-011242295b2a	c36f016a-fbc7-45cf-a547-ba989672d072	72	2026-09-29	2	Poderia estar mais saborosa.	2026-09-29 15:42:32.7855-03
6b0b1db4-872c-4cb3-88c7-a6a6373ef057	c36f016a-fbc7-45cf-a547-ba989672d072	73	2026-09-29	3	A refeição estava razoável.	2026-09-29 15:26:07.097169-03
d029afb3-2f88-4c6e-b63a-a47da2c55a1b	c36f016a-fbc7-45cf-a547-ba989672d072	74	2026-09-29	1	A refeição não estava agradável.	2026-09-29 18:03:48.78386-03
e4cbeddd-f41c-4724-b0ae-9bfba953c681	c36f016a-fbc7-45cf-a547-ba989672d072	75	2026-09-30	5	\N	2026-09-30 16:28:23.281119-03
a80bdaad-7105-47d6-855c-3940d253e2f5	c36f016a-fbc7-45cf-a547-ba989672d072	76	2026-09-30	1	\N	2026-09-30 16:26:20.866398-03
3a565da3-b88c-43a2-8d4b-1d0e9b795088	c36f016a-fbc7-45cf-a547-ba989672d072	77	2026-09-30	1	\N	2026-09-30 16:10:20.622994-03
2cba39c8-2085-4772-9050-8325b51f61b3	c36f016a-fbc7-45cf-a547-ba989672d072	85	2026-10-05	4	Boa refeição e bem servida.	2026-10-05 13:51:22.909015-03
31f49e49-a306-4ccf-ae59-f304519af05e	c36f016a-fbc7-45cf-a547-ba989672d072	86	2026-10-05	3	\N	2026-10-05 13:53:37.63709-03
f21f92e3-0a2a-42d4-bc97-c4cf2744d711	c36f016a-fbc7-45cf-a547-ba989672d072	87	2026-10-06	3	Estava boa no geral.	2026-10-06 18:50:39.901208-03
a1986425-ed91-4694-a642-9a186addb252	c36f016a-fbc7-45cf-a547-ba989672d072	88	2026-10-06	5	Adorei o cardápio de hoje!	2026-10-06 18:10:19.742289-03
73e8e3cd-9bad-43ce-b857-0f70ae7d3d3f	c36f016a-fbc7-45cf-a547-ba989672d072	89	2026-10-06	4	Estava muito saborosa.	2026-10-06 18:13:53.793225-03
061c0a33-8f72-48b0-ba05-63efa03ac1b8	c36f016a-fbc7-45cf-a547-ba989672d072	90	2026-10-07	1	A refeição não estava agradável.	2026-10-07 16:18:21.454492-03
9a8aa1d6-3611-4518-b6d0-4c6415258565	c36f016a-fbc7-45cf-a547-ba989672d072	91	2026-10-07	5	Excelente refeição!	2026-10-07 16:07:52.94938-03
7eed2729-f63b-42d2-bfc3-519bed8de7f3	c36f016a-fbc7-45cf-a547-ba989672d072	92	2026-10-07	4	\N	2026-10-07 18:04:10.176003-03
118317da-5e23-4946-92ff-bb79528a0be9	c36f016a-fbc7-45cf-a547-ba989672d072	93	2026-10-08	4	\N	2026-10-08 15:36:51.659532-03
ccfeafcd-b67d-461d-9d75-87e9b7322a41	c36f016a-fbc7-45cf-a547-ba989672d072	58	2026-09-22	3	\N	2026-09-22 15:30:27.957476-03
92eef7a1-5450-49a1-814c-f4d3aa608c2d	c36f016a-fbc7-45cf-a547-ba989672d072	61	2026-09-23	4	Gostei bastante da refeição.	2026-09-23 18:22:33.665133-03
75f56232-c4ad-4374-a8da-3b423d5e1087	c36f016a-fbc7-45cf-a547-ba989672d072	56	2026-09-21	3	\N	2026-09-21 18:10:49.057343-03
c93d4427-5bd3-417d-a11a-0bf045bd8988	c36f016a-fbc7-45cf-a547-ba989672d072	59	2026-09-22	5	Adorei o cardápio de hoje!	2026-09-22 15:43:56.780512-03
1340bf41-4467-40c0-b134-81b4c3f62328	c36f016a-fbc7-45cf-a547-ba989672d072	62	2026-09-23	5	Adorei o cardápio de hoje!	2026-09-23 14:52:46.265994-03
895497d9-ba8b-467d-b056-9db6bdca0116	c36f016a-fbc7-45cf-a547-ba989672d072	63	2026-09-24	3	A refeição estava razoável.	2026-09-24 14:26:04.182123-03
3534fff8-7085-4ad4-9709-b0c82dd7c2d4	c36f016a-fbc7-45cf-a547-ba989672d072	94	2026-10-08	3	Gostei, mas pode melhorar.	2026-10-08 15:05:08.178701-03
f79621a5-3604-4a0f-b351-3a6c9cf58228	c36f016a-fbc7-45cf-a547-ba989672d072	95	2026-10-08	3	Estava boa no geral.	2026-10-08 15:35:58.109624-03
1b03e172-5439-46e6-9d8a-40ee54b07811	c36f016a-fbc7-45cf-a547-ba989672d072	80	2026-10-01	3	\N	2026-10-01 16:11:45.709091-03
e9a9d00d-c06a-426e-a612-6c83671c164a	c36f016a-fbc7-45cf-a547-ba989672d072	81	2026-10-02	5	Excelente refeição!	2026-10-02 18:50:00.023465-03
d5f6efcd-ee6b-462a-91fb-3728cf804374	c36f016a-fbc7-45cf-a547-ba989672d072	83	2026-10-02	3	\N	2026-10-02 13:38:15.077802-03
04d909c0-a155-422a-8a84-1a1660f07c18	c36f016a-fbc7-45cf-a547-ba989672d072	84	2026-10-05	5	Excelente refeição!	2026-10-05 16:41:17.675356-03
5ab9aa2a-635d-499e-8d8d-08a0c7afbd37	c36f016a-fbc7-45cf-a547-ba989672d072	96	2026-10-09	4	\N	2026-10-09 13:18:56.214841-03
25590e74-eb5a-4a75-aa0b-91dba6a5b3d3	c36f016a-fbc7-45cf-a547-ba989672d072	97	2026-10-09	5	Estava tudo muito gostoso.	2026-10-09 13:10:03.227248-03
5bf31c3e-611f-4e49-8a55-fd1c3099badf	c36f016a-fbc7-45cf-a547-ba989672d072	98	2026-10-09	1	O sabor poderia melhorar.	2026-10-09 13:39:05.680692-03
ab19c59e-12e6-4bf5-a6f2-bc50e00c5d87	c36f016a-fbc7-45cf-a547-ba989672d072	54	2026-09-21	1	\N	2026-09-21 18:33:22.549421-03
a1031a5f-946b-4c72-85d6-5379547196ff	c36f016a-fbc7-45cf-a547-ba989672d072	60	2026-09-23	3	\N	2026-09-23 14:15:31.05523-03
01759ad5-788a-47e4-9f4c-904e98acb299	c36f016a-fbc7-45cf-a547-ba989672d072	57	2026-09-22	4	Boa refeição e bem servida.	2026-09-22 13:52:11.533812-03
392cb8c4-4613-41db-b59c-9dd7579eab5c	c36f016a-fbc7-45cf-a547-ba989672d072	78	2026-10-01	4	Estava muito saborosa.	2026-10-01 13:04:46.129102-03
293e583c-1c53-4237-a6c7-b274275c4439	c36f016a-fbc7-45cf-a547-ba989672d072	79	2026-10-01	5	Excelente refeição!	2026-10-01 18:27:31.496531-03
1b26868c-ea20-4b3f-80f9-24d00c22794b	c36f016a-fbc7-45cf-a547-ba989672d072	82	2026-10-02	5	Adorei o cardápio de hoje!	2026-10-02 16:36:23.579332-03
\.


--
-- Data for Name: refeicoes; Type: TABLE DATA; Schema: public; Owner: cardapio
--

COPY public.refeicoes (id, periodo, descricao, data, nome, imagem_url) FROM stdin;
1	manha	Uma pausa leve para começar bem o turno.	2026-08-24	Lanche da manhã	\N
4	manha	Uma pausa leve para começar bem o turno.	2026-08-25	Lanche da manhã	\N
14	almoco	Refeição completa preparada para o dia de aula.	2026-08-28	Almoço	\N
15	tarde	Energia para finalizar as atividades.	2026-08-28	Lanche da tarde	\N
31	manha	Pão com carne moída ao molho e suco de fruta.	2026-08-06	Cachorro-quente	\N
32	almoco	Arroz, feijão, frango assado, salada e fruta.	2026-08-06	Arroz, feijão e frango	\N
33	tarde	Bolo caseiro acompanhado de vitamina de banana.	2026-08-06	Bolo com vitamina	\N
34	manha	Cuscuz de milho com ovos mexidos e café com leite.	2026-08-08	Cuscuz com ovos	\N
35	almoco	Macarrão ao molho de tomate com carne moída e legumes.	2026-08-08	Macarronada com carne	\N
36	tarde	Sanduíche de frango com salada e suco de acerola.	2026-08-08	Sanduíche natural	\N
2	almoco	Refeição completa preparada para o dia de aula.	2026-08-24	Almoço	\N
7	manha	Cuscuz com salsicha assada	2026-08-26	Cuscuz com salsicha	\N
8	almoco	Arroz, feijão e galinha assada	2026-08-26	Galinha assada	\N
9	tarde	Pão com ovo e vitamina	2026-08-26	Pão com ovo	\N
10	manha	arroz com caldo de frango	2026-08-27	risoto	\N
11	almoco	macarrão e galinha guisada	2026-08-27	galinha guisada	\N
12	tarde	frutas cortadas e recheio de leite condensado em um copo de plástico	2026-08-27	salada de frutas	\N
47	tarde	kkkkkkkkkkk	2026-08-25	Pizza de pernas de aranha seca ao molho.	\N
53	manha	testando	2026-09-18	TESTE BKP OLHA A DATA	\N
64	almoco	Filé de peixe assado com ervas, purê de batatas cremoso, arroz e feijão.	2026-09-24	Peixe ao forno com purê	\N
65	tarde	Pão integral com pasta de frango desfiado, cenoura ralada e suco de uva.	2026-09-24	Sanduíche natural de frango	\N
66	manha	Pães de queijo artesanais assados na hora acompanhados de achocolatado.	2026-09-25	Pão de queijo quentinho	\N
67	almoco	Feijoada leve tradicional com carnes magras, arroz branco, couve refogada e fatias de laranja.	2026-09-25	Feijoada escolar	\N
68	tarde	Torta integral de banana com canela e suco de goiaba.	2026-09-25	Torta de banana com suco	\N
69	manha	Cuscuz nordestino quentinho servido com carne bovina desfiada e café com leite.	2026-09-28	Cuscuz com carne desfiada	\N
70	almoco	Strogonoff cremoso de frango, arroz branco soltinho, batata palha e salada de tomate.	2026-09-28	Strogonoff de frango com arroz	\N
71	tarde	Pão francês levemente tostado com requeijão cremoso e uma maçã fresca.	2026-09-28	Pão com requeijão e maçã	\N
72	manha	Mingau de aveia suave com um toque de canela e pedaços de banana.	2026-09-29	Mingau de aveia com canela	\N
73	almoco	Carne bovina cozida ao molho com mandioca macia, arroz branco e feijão carioca.	2026-09-29	Carne de panela com mandioca	\N
74	tarde	Fatia generosa de bolo de milho caseiro e suco integral de uva.	2026-09-29	Bolo de milho e suco de uva	\N
75	manha	Pão francês fresquinho prensado com presunto magro e queijo prato, servido com suco de laranja.	2026-09-30	Pão com presunto e queijo	\N
76	almoco	Escondidinho de purê de batata gratinado com recheio de carne moída bem temperada, arroz e salada.	2026-09-30	Escondidinho de carne moída	\N
77	tarde	Biscoitos de polvilho crocantes acompanhados de iogurte de morango.	2026-09-30	Biscoito caseiro com iogurte	\N
87	manha	Pão de forma integral com patê suave de atum com ricota e chá de camomila gelado.	2026-10-06	Pão com pasta de atum	\N
88	almoco	Almôndegas bovinas suculentas ao molho de tomate fresco, purê de batatas e arroz integral.	2026-10-06	Almôndegas ao sugo com purê	\N
89	tarde	Pedaços refrescantes de melancia, mamão e banana com suco de acerola.	2026-10-06	Mix de frutas da estação	\N
90	manha	Tigela de iogurte natural batido com um toque de mel, sementes de chia e morangos picados.	2026-10-07	Iogurte natural com mel e chia	\N
91	almoco	Baião de dois tradicional com queijo coalho e feijão verde, servido com carne de sol acebolada e vinagrete.	2026-10-07	Baião de dois com carne de sol	\N
92	tarde	Pão francês quentinho recheado com queijo minas frescal e suco de caju.	2026-10-07	Sanduíche de queijo branco	\N
93	manha	Crepioca leve recheada com frango desfiado temperado com ervas finas e café com leite.	2026-10-08	Crepioca de frango	\N
58	almoco	Arroz, feijão preto, carne moída refogada com cenoura e batata, acompanhada de farofa.	2026-09-22	Carne moída com legumes	https://drive.google.com/thumbnail?id=1o9mOHJr8-mYRV8JvU_W1XGb_UMvDtauy&sz=w2000
61	almoco	Macarrão espaguete ao molho de tomate caseiro com carne bovina e queijo ralado.	2026-09-23	Macarronada à bolonhesa	https://drive.google.com/thumbnail?id=10ryYYiF45GeFuoRjsyAAqtah9d_wH0Mv&sz=w2000
56	tarde	Bolo de cenoura caseiro acompanhado de suco de laranja natural.	2026-09-21	Bolo de cenoura e suco	\N
59	tarde	Vitamina cremosa de banana com aveia e biscoito integral.	2026-09-22	Vitamina de banana e biscoito	https://lh3.googleusercontent.com/d/19JcebFjow8oJQn8ZJAS2FO9CDQk4hpQa=w2000
62	tarde	Mix de frutas da estação (mamão, melancia e banana) com suco de maracujá.	2026-09-23	Salada de frutas	https://drive.google.com/thumbnail?id=1gHwai9tZqQ_SGMqurBCc3GDv1IGOL6Ws&sz=w2000
63	manha	Tapioca tradicional com queijo e manteiga acompanhada de chá mate gelado.	2026-09-24	Tapioca recheada	\N
94	almoco	Cubos de carne macia cozidos com vagem e cenoura, arroz branco, feijão carioca e farofa crocante.	2026-10-08	Picadinho bovino com legumes	\N
95	tarde	Bolo artesanal de laranja com raspas e suco de abacaxi com hortelã.	2026-10-08	Bolo de laranja e suco	\N
80	tarde	Frutas frescas picadas (abacaxi, melão e uva) salpicadas com granola e suco de goiaba.	2026-10-01	Salada de frutas com granola	https://static.itdg.com.br/images/640-400/ec507d19a44cbec578e81f99e6178616/344944-original.jpg
81	manha	Pães de queijo mineiros assados na hora servidos com suco natural de maracujá.	2026-10-02	Pão de queijo e suco de maracujá	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIp59awxsblsNHBwtSEdGYBtOAJE9Z-H_H7wr_GLx38wxsvBHYQ3usKAI&s=10
83	tarde	Vitamina cremosa de abacate batida com leite e torradas integrais crocantes.	2026-10-02	Vitamina de abacate e torrada	https://lh3.googleusercontent.com/d/1KS8KkoOMta5rwWN-LpYgModQoE6bh5h7=w2000
84	manha	Cuscuz de milho tradicional com queijo derretido por cima e café com leite adoçado.	2026-10-05	Cuscuz com queijo e café	https://lh3.googleusercontent.com/d/1owWU-OPW0ov1TKV65iJ1gu13k7sUYj6W=w2000
86	tarde	Bolo de cacau caseiro fofinho acompanhado de um copo de leite frio.	2026-10-05	Bolo de chocolate e leite	https://lh3.googleusercontent.com/d/1f60JGsPSYJ6gVkM95rduzKdPCfh0dzFG=w2000
96	manha	Pão tostado na manteiga com ovos mexidos cremosos e achocolatado quente.	2026-10-09	Pão na chapa com ovos mexidos	\N
97	almoco	Filé de tilápia grelhada servida com pirão de peixe saboroso, arroz branco e salada de alface e pepino.	2026-10-09	Filé de peixe grelhado com pirão	\N
98	tarde	Fatia de torta integral de maçã com canela e vitamina refrescante de morango.	2026-10-09	Torta de maçã e vitamina	\N
13	almoco	Uma pausa leve para começar bem o turno.	2026-09-18	Lanche da manhã	\N
55	almoco	Arroz branco, feijão carioca, filé de frango grelhado e salada de alface com tomate.	2026-09-21	Frango grelhado com arroz e feijão	\N
54	manha	Cuscuz quentinho com ovos mexidos e café com leite.	2026-09-21	Cuscuz com ovos	\N
60	manha	Iogurte natural batido com frutas e porção de granola crocante.	2026-09-23	Iogurte com granola	https://drive.google.com/thumbnail?id=1f11DC0iLPuIJgYSIFffCRN68PEKLTrEM&sz=w2000
57	manha	Pão francês com queijo branco derretido e maçã fresca.	2026-09-22	Pão com queijo e fruta	https://drive.google.com/thumbnail?id=1j7AH2GbXCXFNk6o53pjQ-19OYytp2gCe&sz=w2000
78	manha	Tapioca recheada com queijo coalho na chapa e café fresco.	2026-10-01	Tapioca de queijo coalho	https://conteudo.imguol.com.br/f0/2020/02/25/tapioca-de-queijo-coalho-com-frango-e-pesto-1582655206865_v2_3x4.jpg
79	almoco	Iscas de peito de frango aceboladas, feijão tropeiro leve, arroz branco e couve fatiada.	2026-10-01	Iscas de frango aceboladas	https://phygital-files.mercafacil.com/tartufo-bucket/uploads/produto/tiras_de_frango_aceboladas_300g_431d5608-8b62-4fcc-a936-53a745c2aa3f.png
82	almoco	Lasanha com massa fresca, molho bolonhesa artesanal, queijo mussarela e salada verde.	2026-10-02	Lasanha à bolonhesa	https://guiadacozinha.com.br/wp-content/uploads/2014/01/lasanha-bolonhesa-na-pressao.jpg
85	almoco	Sobrecoxa de frango assada com batata e cenoura, arroz soltinho, feijão preto e salada de repolho.	2026-10-05	Frango assado com legumes	https://guiadacozinha.com.br/wp-content/uploads/2019/10/frango-assado-cerveja-legumes.jpg
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: cardapio
--

COPY public.schema_migrations (name, applied_at) FROM stdin;
001_initial.sql	2026-08-24 11:36:08.24843-03
002_nomes_em_portugues.sql	2026-08-24 11:36:08.47987-03
003_usuarios_e_tipos.sql	2026-08-24 11:36:08.488373-03
004_garantir_cardapio_inicial.sql	2026-08-24 11:36:08.517383-03
005_remover_nome_e_itens_refeicoes.sql	2026-08-24 11:36:08.527276-03
006_horarios_fixos_refeicoes.sql	2026-08-24 11:36:08.535402-03
007_refeicoes_por_data.sql	2026-08-24 11:36:08.544774-03
008_massa_refeicoes_agosto_2026.sql	2026-08-24 11:36:08.562327-03
009_adicionar_imagem_url_refeicoes.sql	2026-09-21 11:39:37.541403-03
010_solicitacoes_recuperacao_senha.sql	2026-09-21 11:49:42.673387-03
\.


--
-- Data for Name: solicitacoes_recuperacao_senha; Type: TABLE DATA; Schema: public; Owner: cardapio
--

COPY public.solicitacoes_recuperacao_senha (id, usuario_id, senha_hash, solicitado_em) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: cardapio
--

COPY public.usuarios (id, nome, cpf, telefone, email, senha_hash, tipo, criado_em) FROM stdin;
ada9e430-aec6-466b-a0e3-89444b0027cc	Administrador ETE	11111111111	(81) 99999-9999	administrador@ete.local	$2a$10$UXc09G15STwaj7vdVpqaN.jgeVTooECD5L7exgtxEVUchgHtUWZvm	administrador	2026-08-24 11:36:08.24843-03
aa083940-93cc-45f6-9f50-76c0f1e2cd3d	Claudiana Rakelly	17357348458	(22) 22222-2222	claudianarakellypimentel@gmail.com	$2b$10$Md1AWIT7fGeTz3xkSUamjewHEYDqnKEnUzZmxAsfH6Qbg0XU3zJae	administrador	2026-08-24 12:33:20.59531-03
344f94c3-d875-4317-ac68-4a9a867db18e	Murilo	77777777777	(77) 77777-7777	murilo@gmail.com	$2b$10$vBiI2ZbS99j4aIHExproAe1IANGw1YeHmbaglRn6gXS/QbAZbFoJm	aluno	2026-08-24 13:02:32.05781-03
3ac65d3f-c52b-4adf-9dc5-3c3c9ca2eb4d	Vitor	88888888888	(88) 88888-8888	vitor@gmail.com	$2b$10$nOQ2xOzVFnIJ.sUMCyN/Au.ezyR0Y1ArAekIQCh0ewvhI6vNcPxIy	aluno	2026-08-24 13:03:18.908568-03
47fc8838-00ed-4d8c-a348-e77877703503	weslley	00000000009	(00) 00000-0009	weslley@gmail.com	$2b$10$K4/6s7hpzBwmeEBuAon1GubAoBlYKpNSWbhYLHgtxopSck24VebCe	aluno	2026-08-24 13:04:54.413341-03
6aadb67a-9af0-4b3f-b115-0e1a2b2e8c00	Bianca	15329389429	(33) 33333-3333	bianca@gmail.com	$2b$10$ibLpUR6DNrfui9/eBR7UFOaMOZqwGVAKH4NPLNpN6PbboyV9K6qn.	cozinha	2026-08-24 13:00:51.314782-03
fce07bd2-0abe-49a2-af26-7508b7b6aea0	Sandro Ricardo	12345678910	(00) 00000-0000	sandroricardo@gmail.com	$2b$10$O58vXiRz3OBpENFlCBGMA.wC6nuJYf9owYxrMEApdOD.vTMvFaN7.	aluno	2026-08-24 13:06:04.434013-03
da593bba-f6eb-4d54-b83a-e05554d9dff0	Alessandro	15988680470	(00) 00000-0000	alessandro@gmail.com	$2b$10$vMLWj5he/tz803Q43j5gQ.vIAmYrSivxl/LZhoE.YfyxMbE5Q8l0e	aluno	2026-08-24 13:00:21.030301-03
8799c70e-a004-4e8e-b655-55c5f95332a0	João Gabriel	15635901409	(33) 33333-3333	joao.gariel@gmail.com	$2b$10$lbNMH02mbgoq/9xqyqpjn.FVa1MX4hVnt8.wqCcQiu6UMLwt3q3O6	administrador	2026-08-24 12:35:09.213567-03
71800530-dbb1-4f13-ad9a-350c4c866ab6	Kauã	66666666666	(66) 66666-6666	kaua@gmail.com	$2b$10$5lYaVxNArsbaHhJFwT4M8eQEQmT7OLNOh8ns2UuZKcpRSThPOyJQO	aluno	2026-08-24 13:02:04.465791-03
335edd30-bd49-421b-9b2e-bec9512fa23f	José Arthur	99999999999	(99) 99999-9999	josearthur@gmail.com	$2b$10$3O9GEk/IcUaxdkX9U7Rc/umwWcP0bPvRfcweDWaTeklxoj9gstDB6	aluno	2026-08-24 13:03:50.726699-03
a638b2d9-b73d-4d0e-aa30-77654884290c	Ellen Vitória	00000000000	(11) 11111-1111	ellen.vitoria@gmail.com	$2b$10$MWu65QMjjT3GKaWObDVGGerDSZHWYVyEWZKRk0rI3WUoyY6E.hiAm	administrador	2026-08-24 12:32:25.489665-03
c36f016a-fbc7-45cf-a547-ba989672d072	George	44444444444	(44) 44444-4444	george@gmail.com	$2b$10$8sNKUyT1ucdIuV14NCRYFOdFCLUUH.lr.n1HtKiqqW3Bnn90W3IDm	aluno	2026-08-24 13:01:17.980467-03
bedd76b2-e208-4e18-8a23-291bdfa635f5	Gustavo	55555555555	(55) 55555-5555	gustavo@gmail.com	$2b$10$5YmiP/LSKsqDuh8mgqN4RuH5ZIeK3Jr2NB9gu7tSQ1ckKSx5D.qxO	cozinha	2026-08-24 13:01:41.565897-03
\.


--
-- Name: refeicoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cardapio
--

SELECT pg_catalog.setval('public.refeicoes_id_seq', 99, true);


--
-- Name: avaliacoes avaliacoes_pkey; Type: CONSTRAINT; Schema: public; Owner: cardapio
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT avaliacoes_pkey PRIMARY KEY (id);


--
-- Name: avaliacoes avaliacoes_usuario_id_refeicao_id_servido_em_key; Type: CONSTRAINT; Schema: public; Owner: cardapio
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT avaliacoes_usuario_id_refeicao_id_servido_em_key UNIQUE (usuario_id, refeicao_id, servido_em);


--
-- Name: refeicoes refeicoes_data_periodo_key; Type: CONSTRAINT; Schema: public; Owner: cardapio
--

ALTER TABLE ONLY public.refeicoes
    ADD CONSTRAINT refeicoes_data_periodo_key UNIQUE (data, periodo);


--
-- Name: refeicoes refeicoes_pkey; Type: CONSTRAINT; Schema: public; Owner: cardapio
--

ALTER TABLE ONLY public.refeicoes
    ADD CONSTRAINT refeicoes_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: cardapio
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (name);


--
-- Name: solicitacoes_recuperacao_senha solicitacoes_recuperacao_senha_pkey; Type: CONSTRAINT; Schema: public; Owner: cardapio
--

ALTER TABLE ONLY public.solicitacoes_recuperacao_senha
    ADD CONSTRAINT solicitacoes_recuperacao_senha_pkey PRIMARY KEY (id);


--
-- Name: solicitacoes_recuperacao_senha solicitacoes_recuperacao_senha_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: cardapio
--

ALTER TABLE ONLY public.solicitacoes_recuperacao_senha
    ADD CONSTRAINT solicitacoes_recuperacao_senha_usuario_id_key UNIQUE (usuario_id);


--
-- Name: usuarios usuarios_cpf_key; Type: CONSTRAINT; Schema: public; Owner: cardapio
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_cpf_key UNIQUE (cpf);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: cardapio
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: cardapio
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: avaliacoes_servido_em_idx; Type: INDEX; Schema: public; Owner: cardapio
--

CREATE INDEX avaliacoes_servido_em_idx ON public.avaliacoes USING btree (servido_em);


--
-- Name: avaliacoes_usuario_id_idx; Type: INDEX; Schema: public; Owner: cardapio
--

CREATE INDEX avaliacoes_usuario_id_idx ON public.avaliacoes USING btree (usuario_id);


--
-- Name: refeicoes_data_idx; Type: INDEX; Schema: public; Owner: cardapio
--

CREATE INDEX refeicoes_data_idx ON public.refeicoes USING btree (data);


--
-- Name: refeicoes_nome_idx; Type: INDEX; Schema: public; Owner: cardapio
--

CREATE INDEX refeicoes_nome_idx ON public.refeicoes USING btree (nome);


--
-- Name: solicitacoes_recuperacao_senha_data_idx; Type: INDEX; Schema: public; Owner: cardapio
--

CREATE INDEX solicitacoes_recuperacao_senha_data_idx ON public.solicitacoes_recuperacao_senha USING btree (solicitado_em DESC);


--
-- Name: usuarios_email_unico_idx; Type: INDEX; Schema: public; Owner: cardapio
--

CREATE UNIQUE INDEX usuarios_email_unico_idx ON public.usuarios USING btree (email);


--
-- Name: avaliacoes avaliacoes_refeicao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cardapio
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT avaliacoes_refeicao_id_fkey FOREIGN KEY (refeicao_id) REFERENCES public.refeicoes(id) ON DELETE RESTRICT;


--
-- Name: avaliacoes avaliacoes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cardapio
--

ALTER TABLE ONLY public.avaliacoes
    ADD CONSTRAINT avaliacoes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: solicitacoes_recuperacao_senha solicitacoes_recuperacao_senha_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cardapio
--

ALTER TABLE ONLY public.solicitacoes_recuperacao_senha
    ADD CONSTRAINT solicitacoes_recuperacao_senha_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict WCRQh2tT6etUeuzcTS7oqVKEbzPrkaKohLIscsXEVHECl1WjVU5vZzBGpMZb05z

