--
-- PostgreSQL database dump
--

\restrict JhTmu3QvASF7ZqNmvIh8ktVmo5ClCUBhiHSqOVrhI2Xogwv0o90gycNKVwv9mPX

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."RefreshTokens" DROP CONSTRAINT IF EXISTS "FK_RefreshTokens_AspNetUsers_UserId";
ALTER TABLE IF EXISTS ONLY public."Recipes" DROP CONSTRAINT IF EXISTS "FK_Recipes_Categories_CategoryId";
ALTER TABLE IF EXISTS ONLY public."Recipes" DROP CONSTRAINT IF EXISTS "FK_Recipes_AspNetUsers_AuthorId";
ALTER TABLE IF EXISTS ONLY public."RecipeSteps" DROP CONSTRAINT IF EXISTS "FK_RecipeSteps_Recipes_RecipeId";
ALTER TABLE IF EXISTS ONLY public."RecipeIngredients" DROP CONSTRAINT IF EXISTS "FK_RecipeIngredients_Recipes_RecipeId";
ALTER TABLE IF EXISTS ONLY public."RecipeImages" DROP CONSTRAINT IF EXISTS "FK_RecipeImages_Recipes_RecipeId";
ALTER TABLE IF EXISTS ONLY public."RecipeBookmarks" DROP CONSTRAINT IF EXISTS "FK_RecipeBookmarks_Recipes_RecipeId";
ALTER TABLE IF EXISTS ONLY public."RecipeBookmarks" DROP CONSTRAINT IF EXISTS "FK_RecipeBookmarks_AspNetUsers_UserId";
ALTER TABLE IF EXISTS ONLY public."AspNetUserTokens" DROP CONSTRAINT IF EXISTS "FK_AspNetUserTokens_AspNetUsers_UserId";
ALTER TABLE IF EXISTS ONLY public."AspNetUserRoles" DROP CONSTRAINT IF EXISTS "FK_AspNetUserRoles_AspNetUsers_UserId";
ALTER TABLE IF EXISTS ONLY public."AspNetUserRoles" DROP CONSTRAINT IF EXISTS "FK_AspNetUserRoles_AspNetRoles_RoleId";
ALTER TABLE IF EXISTS ONLY public."AspNetUserLogins" DROP CONSTRAINT IF EXISTS "FK_AspNetUserLogins_AspNetUsers_UserId";
ALTER TABLE IF EXISTS ONLY public."AspNetUserClaims" DROP CONSTRAINT IF EXISTS "FK_AspNetUserClaims_AspNetUsers_UserId";
ALTER TABLE IF EXISTS ONLY public."AspNetRoleClaims" DROP CONSTRAINT IF EXISTS "FK_AspNetRoleClaims_AspNetRoles_RoleId";
ALTER TABLE IF EXISTS ONLY hangfire.state DROP CONSTRAINT IF EXISTS state_jobid_fkey;
ALTER TABLE IF EXISTS ONLY hangfire.jobparameter DROP CONSTRAINT IF EXISTS jobparameter_jobid_fkey;
DROP INDEX IF EXISTS public."UserNameIndex";
DROP INDEX IF EXISTS public."RoleNameIndex";
DROP INDEX IF EXISTS public."IX_RefreshTokens_UserId";
DROP INDEX IF EXISTS public."IX_Recipes_Slug";
DROP INDEX IF EXISTS public."IX_Recipes_CategoryId";
DROP INDEX IF EXISTS public."IX_Recipes_AuthorId";
DROP INDEX IF EXISTS public."IX_RecipeSteps_RecipeId";
DROP INDEX IF EXISTS public."IX_RecipeIngredients_RecipeId";
DROP INDEX IF EXISTS public."IX_RecipeImages_RecipeId";
DROP INDEX IF EXISTS public."IX_RecipeBookmarks_UserId_RecipeId";
DROP INDEX IF EXISTS public."IX_RecipeBookmarks_RecipeId";
DROP INDEX IF EXISTS public."IX_NewsletterSubscribers_UnsubscribeToken";
DROP INDEX IF EXISTS public."IX_NewsletterSubscribers_NormalizedEmail";
DROP INDEX IF EXISTS public."IX_AspNetUserRoles_RoleId";
DROP INDEX IF EXISTS public."IX_AspNetUserLogins_UserId";
DROP INDEX IF EXISTS public."IX_AspNetUserClaims_UserId";
DROP INDEX IF EXISTS public."IX_AspNetRoleClaims_RoleId";
DROP INDEX IF EXISTS public."EmailIndex";
DROP INDEX IF EXISTS hangfire.ix_hangfire_state_jobid;
DROP INDEX IF EXISTS hangfire.ix_hangfire_set_key_score;
DROP INDEX IF EXISTS hangfire.ix_hangfire_set_expireat;
DROP INDEX IF EXISTS hangfire.ix_hangfire_list_expireat;
DROP INDEX IF EXISTS hangfire.ix_hangfire_jobqueue_queueandfetchedat;
DROP INDEX IF EXISTS hangfire.ix_hangfire_jobqueue_jobidandqueue;
DROP INDEX IF EXISTS hangfire.ix_hangfire_jobqueue_fetchedat_queue_jobid;
DROP INDEX IF EXISTS hangfire.ix_hangfire_jobparameter_jobidandname;
DROP INDEX IF EXISTS hangfire.ix_hangfire_job_statename_is_not_null;
DROP INDEX IF EXISTS hangfire.ix_hangfire_job_statename;
DROP INDEX IF EXISTS hangfire.ix_hangfire_job_expireat;
DROP INDEX IF EXISTS hangfire.ix_hangfire_hash_expireat;
DROP INDEX IF EXISTS hangfire.ix_hangfire_counter_key;
DROP INDEX IF EXISTS hangfire.ix_hangfire_counter_expireat;
ALTER TABLE IF EXISTS ONLY public."__EFMigrationsHistory" DROP CONSTRAINT IF EXISTS "PK___EFMigrationsHistory";
ALTER TABLE IF EXISTS ONLY public."RefreshTokens" DROP CONSTRAINT IF EXISTS "PK_RefreshTokens";
ALTER TABLE IF EXISTS ONLY public."Recipes" DROP CONSTRAINT IF EXISTS "PK_Recipes";
ALTER TABLE IF EXISTS ONLY public."RecipeSteps" DROP CONSTRAINT IF EXISTS "PK_RecipeSteps";
ALTER TABLE IF EXISTS ONLY public."RecipeIngredients" DROP CONSTRAINT IF EXISTS "PK_RecipeIngredients";
ALTER TABLE IF EXISTS ONLY public."RecipeImages" DROP CONSTRAINT IF EXISTS "PK_RecipeImages";
ALTER TABLE IF EXISTS ONLY public."RecipeBookmarks" DROP CONSTRAINT IF EXISTS "PK_RecipeBookmarks";
ALTER TABLE IF EXISTS ONLY public."NewsletterSubscribers" DROP CONSTRAINT IF EXISTS "PK_NewsletterSubscribers";
ALTER TABLE IF EXISTS ONLY public."Categories" DROP CONSTRAINT IF EXISTS "PK_Categories";
ALTER TABLE IF EXISTS ONLY public."AspNetUsers" DROP CONSTRAINT IF EXISTS "PK_AspNetUsers";
ALTER TABLE IF EXISTS ONLY public."AspNetUserTokens" DROP CONSTRAINT IF EXISTS "PK_AspNetUserTokens";
ALTER TABLE IF EXISTS ONLY public."AspNetUserRoles" DROP CONSTRAINT IF EXISTS "PK_AspNetUserRoles";
ALTER TABLE IF EXISTS ONLY public."AspNetUserLogins" DROP CONSTRAINT IF EXISTS "PK_AspNetUserLogins";
ALTER TABLE IF EXISTS ONLY public."AspNetUserClaims" DROP CONSTRAINT IF EXISTS "PK_AspNetUserClaims";
ALTER TABLE IF EXISTS ONLY public."AspNetRoles" DROP CONSTRAINT IF EXISTS "PK_AspNetRoles";
ALTER TABLE IF EXISTS ONLY public."AspNetRoleClaims" DROP CONSTRAINT IF EXISTS "PK_AspNetRoleClaims";
ALTER TABLE IF EXISTS ONLY hangfire.state DROP CONSTRAINT IF EXISTS state_pkey;
ALTER TABLE IF EXISTS ONLY hangfire.set DROP CONSTRAINT IF EXISTS set_pkey;
ALTER TABLE IF EXISTS ONLY hangfire.set DROP CONSTRAINT IF EXISTS set_key_value_key;
ALTER TABLE IF EXISTS ONLY hangfire.server DROP CONSTRAINT IF EXISTS server_pkey;
ALTER TABLE IF EXISTS ONLY hangfire.schema DROP CONSTRAINT IF EXISTS schema_pkey;
ALTER TABLE IF EXISTS ONLY hangfire.lock DROP CONSTRAINT IF EXISTS lock_resource_key;
ALTER TABLE IF EXISTS ONLY hangfire.list DROP CONSTRAINT IF EXISTS list_pkey;
ALTER TABLE IF EXISTS ONLY hangfire.jobqueue DROP CONSTRAINT IF EXISTS jobqueue_pkey;
ALTER TABLE IF EXISTS ONLY hangfire.jobparameter DROP CONSTRAINT IF EXISTS jobparameter_pkey;
ALTER TABLE IF EXISTS ONLY hangfire.job DROP CONSTRAINT IF EXISTS job_pkey;
ALTER TABLE IF EXISTS ONLY hangfire.hash DROP CONSTRAINT IF EXISTS hash_pkey;
ALTER TABLE IF EXISTS ONLY hangfire.hash DROP CONSTRAINT IF EXISTS hash_key_field_key;
ALTER TABLE IF EXISTS ONLY hangfire.counter DROP CONSTRAINT IF EXISTS counter_pkey;
ALTER TABLE IF EXISTS ONLY hangfire.aggregatedcounter DROP CONSTRAINT IF EXISTS aggregatedcounter_pkey;
ALTER TABLE IF EXISTS ONLY hangfire.aggregatedcounter DROP CONSTRAINT IF EXISTS aggregatedcounter_key_key;
ALTER TABLE IF EXISTS hangfire.state ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS hangfire.set ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS hangfire.list ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS hangfire.jobqueue ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS hangfire.jobparameter ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS hangfire.job ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS hangfire.hash ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS hangfire.counter ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS hangfire.aggregatedcounter ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public."__EFMigrationsHistory";
DROP TABLE IF EXISTS public."RefreshTokens";
DROP TABLE IF EXISTS public."Recipes";
DROP TABLE IF EXISTS public."RecipeSteps";
DROP TABLE IF EXISTS public."RecipeIngredients";
DROP TABLE IF EXISTS public."RecipeImages";
DROP TABLE IF EXISTS public."RecipeBookmarks";
DROP TABLE IF EXISTS public."NewsletterSubscribers";
DROP TABLE IF EXISTS public."Categories";
DROP TABLE IF EXISTS public."AspNetUsers";
DROP TABLE IF EXISTS public."AspNetUserTokens";
DROP TABLE IF EXISTS public."AspNetUserRoles";
DROP TABLE IF EXISTS public."AspNetUserLogins";
DROP TABLE IF EXISTS public."AspNetUserClaims";
DROP TABLE IF EXISTS public."AspNetRoles";
DROP TABLE IF EXISTS public."AspNetRoleClaims";
DROP SEQUENCE IF EXISTS hangfire.state_id_seq;
DROP TABLE IF EXISTS hangfire.state;
DROP SEQUENCE IF EXISTS hangfire.set_id_seq;
DROP TABLE IF EXISTS hangfire.set;
DROP TABLE IF EXISTS hangfire.server;
DROP TABLE IF EXISTS hangfire.schema;
DROP TABLE IF EXISTS hangfire.lock;
DROP SEQUENCE IF EXISTS hangfire.list_id_seq;
DROP TABLE IF EXISTS hangfire.list;
DROP SEQUENCE IF EXISTS hangfire.jobqueue_id_seq;
DROP TABLE IF EXISTS hangfire.jobqueue;
DROP SEQUENCE IF EXISTS hangfire.jobparameter_id_seq;
DROP TABLE IF EXISTS hangfire.jobparameter;
DROP SEQUENCE IF EXISTS hangfire.job_id_seq;
DROP TABLE IF EXISTS hangfire.job;
DROP SEQUENCE IF EXISTS hangfire.hash_id_seq;
DROP TABLE IF EXISTS hangfire.hash;
DROP SEQUENCE IF EXISTS hangfire.counter_id_seq;
DROP TABLE IF EXISTS hangfire.counter;
DROP SEQUENCE IF EXISTS hangfire.aggregatedcounter_id_seq;
DROP TABLE IF EXISTS hangfire.aggregatedcounter;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS unaccent;
DROP EXTENSION IF EXISTS pg_trgm;
DROP SCHEMA IF EXISTS hangfire;
--
-- Name: hangfire; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hangfire;


ALTER SCHEMA hangfire OWNER TO postgres;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: aggregatedcounter; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.aggregatedcounter (
    id bigint NOT NULL,
    key text NOT NULL,
    value bigint NOT NULL,
    expireat timestamp with time zone
);


ALTER TABLE hangfire.aggregatedcounter OWNER TO postgres;

--
-- Name: aggregatedcounter_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.aggregatedcounter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.aggregatedcounter_id_seq OWNER TO postgres;

--
-- Name: aggregatedcounter_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.aggregatedcounter_id_seq OWNED BY hangfire.aggregatedcounter.id;


--
-- Name: counter; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.counter (
    id bigint NOT NULL,
    key text NOT NULL,
    value bigint NOT NULL,
    expireat timestamp with time zone
);


ALTER TABLE hangfire.counter OWNER TO postgres;

--
-- Name: counter_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.counter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.counter_id_seq OWNER TO postgres;

--
-- Name: counter_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.counter_id_seq OWNED BY hangfire.counter.id;


--
-- Name: hash; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.hash (
    id bigint NOT NULL,
    key text NOT NULL,
    field text NOT NULL,
    value text,
    expireat timestamp with time zone,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.hash OWNER TO postgres;

--
-- Name: hash_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.hash_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.hash_id_seq OWNER TO postgres;

--
-- Name: hash_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.hash_id_seq OWNED BY hangfire.hash.id;


--
-- Name: job; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.job (
    id bigint NOT NULL,
    stateid bigint,
    statename text,
    invocationdata jsonb NOT NULL,
    arguments jsonb NOT NULL,
    createdat timestamp with time zone NOT NULL,
    expireat timestamp with time zone,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.job OWNER TO postgres;

--
-- Name: job_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.job_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.job_id_seq OWNER TO postgres;

--
-- Name: job_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.job_id_seq OWNED BY hangfire.job.id;


--
-- Name: jobparameter; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.jobparameter (
    id bigint NOT NULL,
    jobid bigint NOT NULL,
    name text NOT NULL,
    value text,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.jobparameter OWNER TO postgres;

--
-- Name: jobparameter_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.jobparameter_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.jobparameter_id_seq OWNER TO postgres;

--
-- Name: jobparameter_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.jobparameter_id_seq OWNED BY hangfire.jobparameter.id;


--
-- Name: jobqueue; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.jobqueue (
    id bigint NOT NULL,
    jobid bigint NOT NULL,
    queue text NOT NULL,
    fetchedat timestamp with time zone,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.jobqueue OWNER TO postgres;

--
-- Name: jobqueue_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.jobqueue_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.jobqueue_id_seq OWNER TO postgres;

--
-- Name: jobqueue_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.jobqueue_id_seq OWNED BY hangfire.jobqueue.id;


--
-- Name: list; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.list (
    id bigint NOT NULL,
    key text NOT NULL,
    value text,
    expireat timestamp with time zone,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.list OWNER TO postgres;

--
-- Name: list_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.list_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.list_id_seq OWNER TO postgres;

--
-- Name: list_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.list_id_seq OWNED BY hangfire.list.id;


--
-- Name: lock; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.lock (
    resource text NOT NULL,
    updatecount integer DEFAULT 0 NOT NULL,
    acquired timestamp with time zone
);


ALTER TABLE hangfire.lock OWNER TO postgres;

--
-- Name: schema; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.schema (
    version integer NOT NULL
);


ALTER TABLE hangfire.schema OWNER TO postgres;

--
-- Name: server; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.server (
    id text NOT NULL,
    data jsonb,
    lastheartbeat timestamp with time zone NOT NULL,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.server OWNER TO postgres;

--
-- Name: set; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.set (
    id bigint NOT NULL,
    key text NOT NULL,
    score double precision NOT NULL,
    value text NOT NULL,
    expireat timestamp with time zone,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.set OWNER TO postgres;

--
-- Name: set_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.set_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.set_id_seq OWNER TO postgres;

--
-- Name: set_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.set_id_seq OWNED BY hangfire.set.id;


--
-- Name: state; Type: TABLE; Schema: hangfire; Owner: postgres
--

CREATE TABLE hangfire.state (
    id bigint NOT NULL,
    jobid bigint NOT NULL,
    name text NOT NULL,
    reason text,
    createdat timestamp with time zone NOT NULL,
    data jsonb,
    updatecount integer DEFAULT 0 NOT NULL
);


ALTER TABLE hangfire.state OWNER TO postgres;

--
-- Name: state_id_seq; Type: SEQUENCE; Schema: hangfire; Owner: postgres
--

CREATE SEQUENCE hangfire.state_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE hangfire.state_id_seq OWNER TO postgres;

--
-- Name: state_id_seq; Type: SEQUENCE OWNED BY; Schema: hangfire; Owner: postgres
--

ALTER SEQUENCE hangfire.state_id_seq OWNED BY hangfire.state.id;


--
-- Name: AspNetRoleClaims; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetRoleClaims" (
    "Id" integer NOT NULL,
    "RoleId" text NOT NULL,
    "ClaimType" text,
    "ClaimValue" text
);


ALTER TABLE public."AspNetRoleClaims" OWNER TO postgres;

--
-- Name: AspNetRoleClaims_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."AspNetRoleClaims" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."AspNetRoleClaims_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: AspNetRoles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetRoles" (
    "Id" text NOT NULL,
    "Name" character varying(256),
    "NormalizedName" character varying(256),
    "ConcurrencyStamp" text
);


ALTER TABLE public."AspNetRoles" OWNER TO postgres;

--
-- Name: AspNetUserClaims; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUserClaims" (
    "Id" integer NOT NULL,
    "UserId" text NOT NULL,
    "ClaimType" text,
    "ClaimValue" text
);


ALTER TABLE public."AspNetUserClaims" OWNER TO postgres;

--
-- Name: AspNetUserClaims_Id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."AspNetUserClaims" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."AspNetUserClaims_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: AspNetUserLogins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUserLogins" (
    "LoginProvider" text NOT NULL,
    "ProviderKey" text NOT NULL,
    "ProviderDisplayName" text,
    "UserId" text NOT NULL
);


ALTER TABLE public."AspNetUserLogins" OWNER TO postgres;

--
-- Name: AspNetUserRoles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUserRoles" (
    "UserId" text NOT NULL,
    "RoleId" text NOT NULL
);


ALTER TABLE public."AspNetUserRoles" OWNER TO postgres;

--
-- Name: AspNetUserTokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUserTokens" (
    "UserId" text NOT NULL,
    "LoginProvider" text NOT NULL,
    "Name" text NOT NULL,
    "Value" text
);


ALTER TABLE public."AspNetUserTokens" OWNER TO postgres;

--
-- Name: AspNetUsers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AspNetUsers" (
    "Id" text NOT NULL,
    "DisplayName" text NOT NULL,
    "AvatarUrl" text,
    "Bio" text,
    "IsActive" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UserName" character varying(256),
    "NormalizedUserName" character varying(256),
    "Email" character varying(256),
    "NormalizedEmail" character varying(256),
    "EmailConfirmed" boolean NOT NULL,
    "PasswordHash" text,
    "SecurityStamp" text,
    "ConcurrencyStamp" text,
    "PhoneNumber" text,
    "PhoneNumberConfirmed" boolean NOT NULL,
    "TwoFactorEnabled" boolean NOT NULL,
    "LockoutEnd" timestamp with time zone,
    "LockoutEnabled" boolean NOT NULL,
    "AccessFailedCount" integer NOT NULL
);


ALTER TABLE public."AspNetUsers" OWNER TO postgres;

--
-- Name: Categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Categories" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "Slug" text NOT NULL,
    "Description" text,
    "ImageUrl" text,
    "OrderIndex" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "RowVersion" bytea NOT NULL
);


ALTER TABLE public."Categories" OWNER TO postgres;

--
-- Name: NewsletterSubscribers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NewsletterSubscribers" (
    "Id" uuid NOT NULL,
    "Email" character varying(256) NOT NULL,
    "NormalizedEmail" character varying(256) NOT NULL,
    "CustomerName" character varying(100),
    "FavoriteCategorySlug" character varying(120),
    "Source" character varying(50) NOT NULL,
    "IsActive" boolean NOT NULL,
    "UnsubscribeToken" character varying(64) NOT NULL,
    "SubscribedAt" timestamp with time zone NOT NULL,
    "UnsubscribedAt" timestamp with time zone,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "RowVersion" bytea NOT NULL
);


ALTER TABLE public."NewsletterSubscribers" OWNER TO postgres;

--
-- Name: RecipeBookmarks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RecipeBookmarks" (
    "Id" uuid NOT NULL,
    "UserId" text NOT NULL,
    "RecipeId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "RowVersion" bytea NOT NULL
);


ALTER TABLE public."RecipeBookmarks" OWNER TO postgres;

--
-- Name: RecipeImages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RecipeImages" (
    "Id" uuid NOT NULL,
    "RecipeId" uuid NOT NULL,
    "OriginalUrl" character varying(500) NOT NULL,
    "MediumUrl" character varying(500),
    "ThumbnailUrl" character varying(500),
    "AltText" character varying(200),
    "IsPrimary" boolean NOT NULL,
    "OrderIndex" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "RowVersion" bytea NOT NULL
);


ALTER TABLE public."RecipeImages" OWNER TO postgres;

--
-- Name: RecipeIngredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RecipeIngredients" (
    "Id" uuid NOT NULL,
    "RecipeId" uuid NOT NULL,
    "Name" character varying(100) NOT NULL,
    "Quantity" numeric(10,2),
    "Unit" character varying(50),
    "Notes" character varying(500),
    "OrderIndex" integer NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "RowVersion" bytea NOT NULL
);


ALTER TABLE public."RecipeIngredients" OWNER TO postgres;

--
-- Name: RecipeSteps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RecipeSteps" (
    "Id" uuid NOT NULL,
    "RecipeId" uuid NOT NULL,
    "StepNumber" integer NOT NULL,
    "Title" character varying(150) NOT NULL,
    "Description" character varying(2000) NOT NULL,
    "TimerMinutes" integer,
    "ImageUrl" character varying(500),
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "RowVersion" bytea NOT NULL
);


ALTER TABLE public."RecipeSteps" OWNER TO postgres;

--
-- Name: Recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Recipes" (
    "Id" uuid NOT NULL,
    "Title" character varying(200) NOT NULL,
    "Slug" character varying(220) NOT NULL,
    "Description" text NOT NULL,
    "Instructions" text NOT NULL,
    "PrepTimeMinutes" integer NOT NULL,
    "CookTimeMinutes" integer NOT NULL,
    "Servings" integer NOT NULL,
    "Difficulty" character varying(20) NOT NULL,
    "Status" character varying(20) NOT NULL,
    "CategoryId" uuid NOT NULL,
    "AuthorId" text NOT NULL,
    "PublishedAt" timestamp with time zone,
    "Nutrition_Calories" numeric(8,2),
    "Nutrition_Protein" numeric(8,2),
    "Nutrition_Carbohydrates" numeric(8,2),
    "Nutrition_Fat" numeric(8,2),
    "Nutrition_Fiber" numeric(8,2),
    "Nutrition_Sodium" numeric(8,2),
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone,
    "IsDeleted" boolean NOT NULL,
    "RowVersion" bytea NOT NULL,
    "BookmarkCount" integer DEFAULT 0 NOT NULL,
    "ViewCount" bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public."Recipes" OWNER TO postgres;

--
-- Name: RefreshTokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RefreshTokens" (
    "Id" uuid NOT NULL,
    "UserId" text NOT NULL,
    "TokenHash" text NOT NULL,
    "ExpiresAt" timestamp with time zone NOT NULL,
    "RevokedAt" timestamp with time zone,
    "ReplacedByTokenHash" text,
    "CreatedAt" timestamp with time zone NOT NULL,
    "CreatedByIp" text
);


ALTER TABLE public."RefreshTokens" OWNER TO postgres;

--
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- Name: aggregatedcounter id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.aggregatedcounter ALTER COLUMN id SET DEFAULT nextval('hangfire.aggregatedcounter_id_seq'::regclass);


--
-- Name: counter id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.counter ALTER COLUMN id SET DEFAULT nextval('hangfire.counter_id_seq'::regclass);


--
-- Name: hash id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.hash ALTER COLUMN id SET DEFAULT nextval('hangfire.hash_id_seq'::regclass);


--
-- Name: job id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.job ALTER COLUMN id SET DEFAULT nextval('hangfire.job_id_seq'::regclass);


--
-- Name: jobparameter id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.jobparameter ALTER COLUMN id SET DEFAULT nextval('hangfire.jobparameter_id_seq'::regclass);


--
-- Name: jobqueue id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.jobqueue ALTER COLUMN id SET DEFAULT nextval('hangfire.jobqueue_id_seq'::regclass);


--
-- Name: list id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.list ALTER COLUMN id SET DEFAULT nextval('hangfire.list_id_seq'::regclass);


--
-- Name: set id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.set ALTER COLUMN id SET DEFAULT nextval('hangfire.set_id_seq'::regclass);


--
-- Name: state id; Type: DEFAULT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.state ALTER COLUMN id SET DEFAULT nextval('hangfire.state_id_seq'::regclass);


--
-- Data for Name: aggregatedcounter; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.aggregatedcounter (id, key, value, expireat) FROM stdin;
90	stats:succeeded:2026-11-09	31	2026-12-09 15:40:01.343337+00
202	stats:succeeded:2026-11-10	25	2026-12-10 05:50:11.086313+00
11	stats:succeeded:2026-10-21	2	2026-11-21 11:31:45.648902+00
506	stats:succeeded:2026-11-20-11	13	2026-11-21 11:55:01.737348+00
17	stats:succeeded:2026-10-25	1	2026-11-25 15:02:29.950929+00
470	stats:succeeded:2026-11-20-09	4	2026-11-21 09:15:07.374041+00
20	stats:succeeded:2026-10-26	3	2026-11-26 15:44:43.08163+00
58	stats:succeeded:2026-10-27	4	2026-11-27 03:49:10.292805+00
68	stats:succeeded:2026-10-28	2	2026-11-28 10:20:15.389233+00
73	stats:succeeded:2026-11-03	1	2026-12-03 12:29:34.636986+00
77	stats:succeeded:2026-11-04	1	2026-12-04 02:00:12.965938+00
80	stats:failed:2026-11-04	1	2026-12-04 03:06:15.731011+00
82	stats:succeeded:2026-11-06	1	2026-12-06 07:39:34.908836+00
84	stats:succeeded:2026-11-08	3	2026-12-08 04:56:14.779135+00
480	stats:succeeded:2026-11-20-10	11	2026-11-21 10:55:13.666743+00
3	stats:succeeded	183	\N
541	stats:succeeded:2026-11-20-12	11	2026-11-21 12:50:05.709189+00
441	stats:succeeded:2026-11-20	51	2026-12-20 12:50:04.709189+00
260	stats:succeeded:2026-11-11	55	2026-12-11 16:45:07.601343+00
443	stats:succeeded:2026-11-20-08	12	2026-11-21 08:55:05.809535+00
\.


--
-- Data for Name: counter; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.counter (id, key, value, expireat) FROM stdin;
\.


--
-- Data for Name: hash; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.hash (id, key, field, value, expireat, updatecount) FROM stdin;
1	recurring-job:sitemap-generation	Queue	default	\N	0
2	recurring-job:sitemap-generation	Cron	0 2 * * *	\N	0
3	recurring-job:sitemap-generation	TimeZoneId	UTC	\N	0
4	recurring-job:sitemap-generation	Job	{"Type":"CulinaryBlog.Application.Common.Interfaces.ISitemapGenerationJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","Method":"ExecuteAsync","ParameterTypes":"[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]","Arguments":"[null]"}	\N	0
5	recurring-job:sitemap-generation	CreatedAt	2026-10-21T10:29:27.5805132Z	\N	0
7	recurring-job:sitemap-generation	V	2	\N	0
26	recurring-job:sync-recipe-views	LastExecution	2026-11-20T12:50:05.6571532Z	\N	0
24	recurring-job:sync-recipe-views	NextExecution	2026-11-20T12:55:00.0000000Z	\N	0
27	recurring-job:sync-recipe-views	LastJobId	216	\N	0
10	recurring-job:purge-orphan-files	Queue	default	\N	0
11	recurring-job:purge-orphan-files	Cron	0 2 * * *	\N	0
12	recurring-job:purge-orphan-files	TimeZoneId	UTC	\N	0
13	recurring-job:purge-orphan-files	Job	{"Type":"CulinaryBlog.Application.Common.Interfaces.IPurgeOrphanFilesJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","Method":"ExecuteAsync","ParameterTypes":"[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]","Arguments":"[null]"}	\N	0
14	recurring-job:purge-orphan-files	CreatedAt	2026-11-08T00:03:53.7421091Z	\N	0
16	recurring-job:purge-orphan-files	V	2	\N	0
17	recurring-job:purge-orphan-files	LastExecution	2026-11-20T08:13:02.3024419Z	\N	0
15	recurring-job:purge-orphan-files	NextExecution	2026-11-21T02:00:00.0000000Z	\N	0
18	recurring-job:purge-orphan-files	LastJobId	167	\N	0
19	recurring-job:sync-recipe-views	Queue	default	\N	0
20	recurring-job:sync-recipe-views	Cron	*/5 * * * *	\N	0
21	recurring-job:sync-recipe-views	TimeZoneId	UTC	\N	0
22	recurring-job:sync-recipe-views	Job	{"Type":"CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null","Method":"ExecuteAsync","ParameterTypes":"[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]","Arguments":"[null]"}	\N	0
23	recurring-job:sync-recipe-views	CreatedAt	2026-11-09T09:32:38.4798831Z	\N	0
25	recurring-job:sync-recipe-views	V	2	\N	0
8	recurring-job:sitemap-generation	LastExecution	2026-11-20T08:13:02.3024419Z	\N	0
6	recurring-job:sitemap-generation	NextExecution	2026-11-21T02:00:00.0000000Z	\N	0
9	recurring-job:sitemap-generation	LastJobId	168	\N	0
\.


--
-- Data for Name: job; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.job (id, stateid, statename, invocationdata, arguments, createdat, expireat, updatecount) FROM stdin;
185	529	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 10:25:10.125305+00	2026-11-21 10:25:10.161891+00	0
169	481	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 08:15:02.6412+00	2026-11-21 08:15:02.712792+00	0
179	511	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 09:05:06.659831+00	2026-11-21 09:05:06.712298+00	0
190	544	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 10:50:13.32676+00	2026-11-21 10:50:13.369338+00	0
202	580	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 11:40:30.708284+00	2026-11-21 11:40:30.94144+00	0
173	493	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 08:35:04.156069+00	2026-11-21 08:35:04.191071+00	0
193	553	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 11:00:13.924477+00	2026-11-21 11:00:13.986426+00	0
177	505	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 08:55:05.777051+00	2026-11-21 08:55:05.809535+00	0
206	592	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 12:00:01.997519+00	2026-11-21 12:00:02.029271+00	0
189	541	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 10:45:27.969714+00	2026-11-21 10:45:28.225548+00	0
197	565	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 11:20:07.717593+00	2026-11-21 11:20:07.757756+00	0
210	604	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 12:20:03.281049+00	2026-11-21 12:20:03.325609+00	0
201	577	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.IWelcomeEmailJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[\\"\\\\\\"user_test_restart_1795174765@example.com\\\\\\"\\",\\"\\\\\\"User Test Restart 1795174765\\\\\\"\\",null]", "ParameterTypes": "[\\"System.String, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\",\\"System.String, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\",\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	["\\"user_test_restart_1795174765@example.com\\"", "\\"User Test Restart 1795174765\\"", null]	2026-11-20 11:39:36.233144+00	2026-11-21 11:39:36.532676+00	0
166	476	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 08:13:02.38006+00	2026-11-21 08:13:02.671872+00	0
214	616	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 12:40:04.96548+00	2026-11-21 12:40:05.002513+00	0
170	484	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 08:20:03.007477+00	2026-11-21 08:20:03.076329+00	0
180	514	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 09:10:07.036823+00	2026-11-21 09:10:07.07101+00	0
203	583	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 11:45:01.047264+00	2026-11-21 11:45:01.084581+00	0
194	556	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 11:05:06.930559+00	2026-11-21 11:05:07.032158+00	0
174	496	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 08:40:04.506526+00	2026-11-21 08:40:04.549355+00	0
182	520	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 10:14:39.38219+00	2026-11-21 10:14:39.706711+00	0
216	622	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 12:50:05.664548+00	2026-11-21 12:50:05.709189+00	0
207	595	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 12:05:02.300602+00	2026-11-21 12:05:02.336491+00	0
178	508	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 09:00:06.217205+00	2026-11-21 09:00:06.26057+00	0
186	532	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 10:30:10.444783+00	2026-11-21 10:30:10.483297+00	0
198	568	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 11:25:21.429127+00	2026-11-21 11:25:21.638772+00	0
211	607	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 12:25:03.639474+00	2026-11-21 12:25:03.882592+00	0
213	613	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 12:35:04.471096+00	2026-11-21 12:35:04.598857+00	0
191	547	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.INewsletterWelcomeEmailJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[\\"\\\\\\"testsubscriber@example.com\\\\\\"\\",null,null,\\"\\\\\\"b25bd8461287ebf53375eb7cb648b44a7b6abfc39da50caa\\\\\\"\\",null]", "ParameterTypes": "[\\"System.String, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\",\\"System.String, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\",\\"System.String, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\",\\"System.String, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\",\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	["\\"testsubscriber@example.com\\"", null, null, "\\"b25bd8461287ebf53375eb7cb648b44a7b6abfc39da50caa\\"", null]	2026-11-20 10:50:14.068259+00	2026-11-21 10:50:14.803334+00	0
175	499	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 08:45:04.861179+00	2026-11-21 08:45:04.899934+00	0
171	487	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 08:25:03.362634+00	2026-11-21 08:25:03.412791+00	0
181	517	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 09:15:07.342563+00	2026-11-21 09:15:07.374041+00	0
204	586	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 11:50:01.372166+00	2026-11-21 11:50:01.416426+00	0
195	559	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 11:10:07.266396+00	2026-11-21 11:10:07.309639+00	0
17	94	Failed	{"Type": "CulinaryBlog.Application.Common.Interfaces.IRecipeImageResizeJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[\\"\\\\\\"9ac2d166-8bf3-41fe-8576-dbd38291633d\\\\\\"\\",\\"\\\\\\"47139b39-0e4f-4b42-9731-8d82ccf7c8be\\\\\\"\\",\\"\\\\\\"/culinary-blog/recipes/9ac2d166-8bf3-41fe-8576-dbd38291633d/202c216c-bc96-4fb2-8a1e-53f02100c133.jpg\\\\\\"\\",null]", "ParameterTypes": "[\\"System.Guid, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\",\\"System.Guid, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\",\\"System.String, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\",\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	["\\"9ac2d166-8bf3-41fe-8576-dbd38291633d\\"", "\\"47139b39-0e4f-4b42-9731-8d82ccf7c8be\\"", "\\"/culinary-blog/recipes/9ac2d166-8bf3-41fe-8576-dbd38291633d/202c216c-bc96-4fb2-8a1e-53f02100c133.jpg\\"", null]	2026-11-03 16:00:34.671723+00	\N	0
183	523	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 10:15:09.497635+00	2026-11-21 10:15:09.538395+00	0
208	598	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 12:10:02.641794+00	2026-11-21 12:10:02.676884+00	0
199	571	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 11:30:48.87036+00	2026-11-21 11:30:49.082508+00	0
168	477	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISitemapGenerationJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 08:13:02.469951+00	2026-11-21 08:13:03.182608+00	0
187	535	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 10:35:10.749252+00	2026-11-21 10:35:10.787619+00	0
215	619	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 12:45:05.3115+00	2026-11-21 12:45:05.455418+00	0
172	490	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 08:30:03.766479+00	2026-11-21 08:30:03.800203+00	0
184	526	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 10:20:09.797836+00	2026-11-21 10:20:09.835686+00	0
192	550	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 10:55:13.620199+00	2026-11-21 10:55:13.666743+00	0
205	589	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 11:55:01.703465+00	2026-11-21 11:55:01.737348+00	0
176	502	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 08:50:05.415739+00	2026-11-21 08:50:05.45481+00	0
167	478	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.IPurgeOrphanFilesJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 08:13:02.448667+00	2026-11-21 08:13:03.569738+00	0
188	538	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 10:40:11.061341+00	2026-11-21 10:40:11.096835+00	0
196	562	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 11:15:07.32461+00	2026-11-21 11:15:07.452188+00	0
209	601	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 12:15:02.961986+00	2026-11-21 12:15:03.000945+00	0
212	610	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 12:30:04.120036+00	2026-11-21 12:30:04.243592+00	0
200	574	Succeeded	{"Type": "CulinaryBlog.Application.Common.Interfaces.ISyncRecipeViewsJob, CulinaryBlog.Application, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "Method": "ExecuteAsync", "Arguments": "[null]", "ParameterTypes": "[\\"System.Threading.CancellationToken, System.Private.CoreLib, Version=10.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e\\"]"}	[null]	2026-11-20 11:39:24.134308+00	2026-11-21 11:39:24.33129+00	0
\.


--
-- Data for Name: jobparameter; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.jobparameter (id, jobid, name, value, updatecount) FROM stdin;
549	169	RecurringJobId	"sync-recipe-views"	0
550	169	Time	1795162502	0
551	169	CurrentCulture	"en-US"	0
552	169	CurrentUICulture	"en-US"	0
553	170	RecurringJobId	"sync-recipe-views"	0
554	170	Time	1795162803	0
555	170	CurrentCulture	"en-US"	0
556	170	CurrentUICulture	"en-US"	0
557	171	RecurringJobId	"sync-recipe-views"	0
558	171	Time	1795163103	0
559	171	CurrentCulture	"en-US"	0
560	171	CurrentUICulture	"en-US"	0
561	172	RecurringJobId	"sync-recipe-views"	0
562	172	Time	1795163403	0
563	172	CurrentCulture	"en-US"	0
564	172	CurrentUICulture	"en-US"	0
565	173	RecurringJobId	"sync-recipe-views"	0
566	173	Time	1795163704	0
567	173	CurrentCulture	"en-US"	0
568	173	CurrentUICulture	"en-US"	0
569	174	RecurringJobId	"sync-recipe-views"	0
570	174	Time	1795164004	0
571	174	CurrentCulture	"en-US"	0
572	174	CurrentUICulture	"en-US"	0
573	175	RecurringJobId	"sync-recipe-views"	0
574	175	Time	1795164304	0
575	175	CurrentCulture	"en-US"	0
576	175	CurrentUICulture	"en-US"	0
577	176	RecurringJobId	"sync-recipe-views"	0
578	176	Time	1795164605	0
579	176	CurrentCulture	"en-US"	0
580	176	CurrentUICulture	"en-US"	0
581	177	RecurringJobId	"sync-recipe-views"	0
582	177	Time	1795164905	0
583	177	CurrentCulture	"en-US"	0
584	177	CurrentUICulture	"en-US"	0
585	178	RecurringJobId	"sync-recipe-views"	0
586	178	Time	1795165206	0
587	178	CurrentCulture	"en-US"	0
588	178	CurrentUICulture	"en-US"	0
589	179	RecurringJobId	"sync-recipe-views"	0
590	179	Time	1795165506	0
43	17	CurrentCulture	"en-US"	0
44	17	CurrentUICulture	"en-US"	0
591	179	CurrentCulture	"en-US"	0
592	179	CurrentUICulture	"en-US"	0
593	180	RecurringJobId	"sync-recipe-views"	0
594	180	Time	1795165807	0
595	180	CurrentCulture	"en-US"	0
596	180	CurrentUICulture	"en-US"	0
597	181	RecurringJobId	"sync-recipe-views"	0
598	181	Time	1795166107	0
45	17	RetryCount	10	0
599	181	CurrentCulture	"en-US"	0
600	181	CurrentUICulture	"en-US"	0
601	182	RecurringJobId	"sync-recipe-views"	0
602	182	Time	1795169679	0
603	182	CurrentCulture	"en-US"	0
604	182	CurrentUICulture	"en-US"	0
605	183	RecurringJobId	"sync-recipe-views"	0
606	183	Time	1795169709	0
607	183	CurrentCulture	"en-US"	0
608	183	CurrentUICulture	"en-US"	0
609	184	RecurringJobId	"sync-recipe-views"	0
610	184	Time	1795170009	0
611	184	CurrentCulture	"en-US"	0
612	184	CurrentUICulture	"en-US"	0
613	185	RecurringJobId	"sync-recipe-views"	0
614	185	Time	1795170310	0
615	185	CurrentCulture	"en-US"	0
616	185	CurrentUICulture	"en-US"	0
537	166	RecurringJobId	"sync-recipe-views"	0
538	166	Time	1795162382	0
539	166	CurrentCulture	"en-US"	0
540	166	CurrentUICulture	"en-US"	0
541	167	RecurringJobId	"purge-orphan-files"	0
542	167	Time	1795162382	0
543	167	CurrentCulture	"en-US"	0
544	167	CurrentUICulture	"en-US"	0
545	168	RecurringJobId	"sitemap-generation"	0
546	168	Time	1795162382	0
547	168	CurrentCulture	"en-US"	0
548	168	CurrentUICulture	"en-US"	0
617	186	RecurringJobId	"sync-recipe-views"	0
618	186	Time	1795170610	0
619	186	CurrentCulture	"en-US"	0
620	186	CurrentUICulture	"en-US"	0
621	187	RecurringJobId	"sync-recipe-views"	0
622	187	Time	1795170910	0
623	187	CurrentCulture	"en-US"	0
624	187	CurrentUICulture	"en-US"	0
625	188	RecurringJobId	"sync-recipe-views"	0
626	188	Time	1795171211	0
627	188	CurrentCulture	"en-US"	0
628	188	CurrentUICulture	"en-US"	0
629	189	RecurringJobId	"sync-recipe-views"	0
630	189	Time	1795171527	0
631	189	CurrentCulture	"en-US"	0
632	189	CurrentUICulture	"en-US"	0
633	190	RecurringJobId	"sync-recipe-views"	0
634	190	Time	1795171813	0
635	190	CurrentCulture	"en-US"	0
636	190	CurrentUICulture	"en-US"	0
637	191	CurrentCulture	"en-US"	0
638	191	CurrentUICulture	"en-US"	0
639	192	RecurringJobId	"sync-recipe-views"	0
640	192	Time	1795172113	0
641	192	CurrentCulture	"en-US"	0
642	192	CurrentUICulture	"en-US"	0
643	193	RecurringJobId	"sync-recipe-views"	0
644	193	Time	1795172413	0
645	193	CurrentCulture	"en-US"	0
646	193	CurrentUICulture	"en-US"	0
647	194	RecurringJobId	"sync-recipe-views"	0
648	194	Time	1795172706	0
649	194	CurrentCulture	"en-US"	0
650	194	CurrentUICulture	"en-US"	0
651	195	RecurringJobId	"sync-recipe-views"	0
652	195	Time	1795173007	0
653	195	CurrentCulture	"en-US"	0
654	195	CurrentUICulture	"en-US"	0
655	196	RecurringJobId	"sync-recipe-views"	0
656	196	Time	1795173307	0
657	196	CurrentCulture	"en-US"	0
658	196	CurrentUICulture	"en-US"	0
659	197	RecurringJobId	"sync-recipe-views"	0
660	197	Time	1795173607	0
661	197	CurrentCulture	"en-US"	0
662	197	CurrentUICulture	"en-US"	0
663	198	RecurringJobId	"sync-recipe-views"	0
664	198	Time	1795173921	0
665	198	CurrentCulture	"en-US"	0
666	198	CurrentUICulture	"en-US"	0
667	199	RecurringJobId	"sync-recipe-views"	0
668	199	Time	1795174248	0
669	199	CurrentCulture	"en-US"	0
670	199	CurrentUICulture	"en-US"	0
671	200	RecurringJobId	"sync-recipe-views"	0
672	200	Time	1795174764	0
673	200	CurrentCulture	"en-US"	0
674	200	CurrentUICulture	"en-US"	0
675	201	CurrentCulture	"en-US"	0
676	201	CurrentUICulture	"en-US"	0
677	202	RecurringJobId	"sync-recipe-views"	0
678	202	Time	1795174830	0
679	202	CurrentCulture	"en-US"	0
680	202	CurrentUICulture	"en-US"	0
681	203	RecurringJobId	"sync-recipe-views"	0
682	203	Time	1795175101	0
683	203	CurrentCulture	"en-US"	0
684	203	CurrentUICulture	"en-US"	0
685	204	RecurringJobId	"sync-recipe-views"	0
686	204	Time	1795175401	0
687	204	CurrentCulture	"en-US"	0
688	204	CurrentUICulture	"en-US"	0
689	205	RecurringJobId	"sync-recipe-views"	0
690	205	Time	1795175701	0
691	205	CurrentCulture	"en-US"	0
692	205	CurrentUICulture	"en-US"	0
693	206	RecurringJobId	"sync-recipe-views"	0
694	206	Time	1795176001	0
695	206	CurrentCulture	"en-US"	0
696	206	CurrentUICulture	"en-US"	0
697	207	RecurringJobId	"sync-recipe-views"	0
698	207	Time	1795176302	0
699	207	CurrentCulture	"en-US"	0
700	207	CurrentUICulture	"en-US"	0
701	208	RecurringJobId	"sync-recipe-views"	0
702	208	Time	1795176602	0
703	208	CurrentCulture	"en-US"	0
704	208	CurrentUICulture	"en-US"	0
705	209	RecurringJobId	"sync-recipe-views"	0
706	209	Time	1795176902	0
707	209	CurrentCulture	"en-US"	0
708	209	CurrentUICulture	"en-US"	0
709	210	RecurringJobId	"sync-recipe-views"	0
710	210	Time	1795177203	0
711	210	CurrentCulture	"en-US"	0
712	210	CurrentUICulture	"en-US"	0
713	211	RecurringJobId	"sync-recipe-views"	0
714	211	Time	1795177503	0
715	211	CurrentCulture	"en-US"	0
716	211	CurrentUICulture	"en-US"	0
717	212	RecurringJobId	"sync-recipe-views"	0
718	212	Time	1795177804	0
719	212	CurrentCulture	"en-US"	0
720	212	CurrentUICulture	"en-US"	0
721	213	RecurringJobId	"sync-recipe-views"	0
722	213	Time	1795178104	0
723	213	CurrentCulture	"en-US"	0
724	213	CurrentUICulture	"en-US"	0
725	214	RecurringJobId	"sync-recipe-views"	0
726	214	Time	1795178404	0
727	214	CurrentCulture	"en-US"	0
728	214	CurrentUICulture	"en-US"	0
729	215	RecurringJobId	"sync-recipe-views"	0
730	215	Time	1795178705	0
731	215	CurrentCulture	"en-US"	0
732	215	CurrentUICulture	"en-US"	0
733	216	RecurringJobId	"sync-recipe-views"	0
734	216	Time	1795179005	0
735	216	CurrentCulture	"en-US"	0
736	216	CurrentUICulture	"en-US"	0
\.


--
-- Data for Name: jobqueue; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.jobqueue (id, jobid, queue, fetchedat, updatecount) FROM stdin;
\.


--
-- Data for Name: list; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.list (id, key, value, expireat, updatecount) FROM stdin;
\.


--
-- Data for Name: lock; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.lock (resource, updatecount, acquired) FROM stdin;
\.


--
-- Data for Name: schema; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.schema (version) FROM stdin;
23
\.


--
-- Data for Name: server; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.server (id, data, lastheartbeat, updatecount) FROM stdin;
laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266	{"Queues": ["default"], "StartedAt": "2026-11-20T11:40:30.506243Z", "WorkerCount": 20}	2026-11-20 12:54:02.508507+00	0
\.


--
-- Data for Name: set; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.set (id, key, score, value, expireat, updatecount) FROM stdin;
29	recurring-jobs	1795226400	purge-orphan-files	\N	0
1	recurring-jobs	1795226400	sitemap-generation	\N	0
35	recurring-jobs	1795179300	sync-recipe-views	\N	0
\.


--
-- Data for Name: state; Type: TABLE DATA; Schema: hangfire; Owner: postgres
--

COPY hangfire.state (id, jobid, name, reason, createdat, data, updatecount) FROM stdin;
479	169	Enqueued	Triggered by recurring job scheduler	2026-11-20 08:15:02.649521+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T08:15:02.6493129Z"}	0
491	173	Enqueued	Triggered by recurring job scheduler	2026-11-20 08:35:04.161476+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T08:35:04.1611048Z"}	0
503	177	Enqueued	Triggered by recurring job scheduler	2026-11-20 08:55:05.782583+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T08:55:05.7825150Z"}	0
515	181	Enqueued	Triggered by recurring job scheduler	2026-11-20 09:15:07.347444+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T09:15:07.3473519Z"}	0
527	185	Enqueued	Triggered by recurring job scheduler	2026-11-20 10:25:10.130855+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T10:25:10.1307433Z"}	0
537	188	Processing	\N	2026-11-20 10:40:11.081959+00	{"ServerId": "laptop-9mm7mrfm:7184:4bc8574c-1ecb-4b2c-8104-65a4d6056465", "WorkerId": "a82d609a-93ef-4469-96a3-c732a0fe9557", "StartedAt": "2026-11-20T10:40:11.0769013Z"}	0
550	192	Succeeded	\N	2026-11-20 10:55:13.668498+00	{"Latency": "35", "SucceededAt": "2026-11-20T10:55:13.6600411Z", "PerformanceDuration": "4"}	0
560	196	Enqueued	Triggered by recurring job scheduler	2026-11-20 11:15:07.355684+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T11:15:07.3445277Z"}	0
570	199	Processing	\N	2026-11-20 11:30:48.944308+00	{"ServerId": "laptop-9mm7mrfm:15396:501d2770-1d18-4f49-8e8b-272b8c240528", "WorkerId": "32483233-9e2c-4512-b682-fa3d80370847", "StartedAt": "2026-11-20T11:30:48.9309230Z"}	0
580	202	Succeeded	\N	2026-11-20 11:40:30.942193+00	{"Latency": "86", "SucceededAt": "2026-11-20T11:40:30.9288669Z", "PerformanceDuration": "133"}	0
590	206	Enqueued	Triggered by recurring job scheduler	2026-11-20 12:00:02.003169+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T12:00:02.0030531Z"}	0
592	206	Succeeded	\N	2026-11-20 12:00:02.031102+00	{"Latency": "24", "SucceededAt": "2026-11-20T12:00:02.0255190Z", "PerformanceDuration": "3"}	0
602	210	Enqueued	Triggered by recurring job scheduler	2026-11-20 12:20:03.288923+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T12:20:03.2886057Z"}	0
612	213	Processing	\N	2026-11-20 12:35:04.571487+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "6a813130-2663-471b-8e75-aa41c24e7113", "StartedAt": "2026-11-20T12:35:04.5629656Z"}	0
615	214	Processing	\N	2026-11-20 12:40:04.989288+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "6f662f8e-047c-47f5-8f0e-8e2b7103d9db", "StartedAt": "2026-11-20T12:40:04.9848265Z"}	0
478	167	Succeeded	\N	2026-11-20 08:13:03.57168+00	{"Latency": "34", "SucceededAt": "2026-11-20T08:13:03.5623154Z", "PerformanceDuration": "1079"}	0
49	17	Enqueued	\N	2026-11-03 16:00:34.701147+00	{"Queue": "default", "EnqueuedAt": "2026-11-03T16:00:34.6566766Z"}	0
50	17	Processing	\N	2026-11-03 16:00:34.738095+00	{"ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "WorkerId": "662822f9-b74c-485e-9ae5-e3628cf67ced", "StartedAt": "2026-11-03T16:00:34.7165111Z"}	0
51	17	Failed	An exception occurred during performance of the job.	2026-11-03 16:00:34.905839+00	{"FailedAt": "2026-11-03T16:00:34.8902277Z", "ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "ExceptionType": "SixLabors.ImageSharp.UnknownImageFormatException", "ExceptionDetails": "SixLabors.ImageSharp.UnknownImageFormatException: Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n\\r\\n   at SixLabors.ImageSharp.Image.LoadWithFormatAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at SixLabors.ImageSharp.Image.LoadAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at CulinaryBlog.Infrastructure.Services.ImageProcessingService.CreateThumbnailAsync(Stream imageStream, Int32 width, Int32 height, CancellationToken ct)\\r\\n   at CulinaryBlog.Infrastructure.Jobs.RecipeImageResizeJob.ExecuteAsync(Guid recipeId, Guid imageId, String originalUrl, CancellationToken ct)\\r\\n   at System.RuntimeMethodHandle.InvokeMethod(ObjectHandleOnStack target, Void** arguments, ObjectHandleOnStack sig, BOOL isConstructor, ObjectHandleOnStack result)\\r\\n   at System.Reflection.MethodBaseInvoker.InterpretedInvoke_Method(Object obj, IntPtr* args)\\r\\n   at System.Reflection.MethodBaseInvoker.InvokeWithNoArgs(Object obj, BindingFlags invokeAttr)\\r\\n", "ExceptionMessage": "Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n"}	0
52	17	Scheduled	Retry attempt 1 of 10: Image cannot be loaded. Available decoders:\r\n - T…	2026-11-03 16:00:34.912624+00	{"EnqueueAt": "2026-11-03T16:01:18.9024746Z", "ScheduledAt": "2026-11-03T16:00:34.9025312Z"}	0
53	17	Enqueued	Triggered by DelayedJobScheduler	2026-11-03 16:01:18.911654+00	{"Queue": "default", "EnqueuedAt": "2026-11-03T16:01:18.9042547Z"}	0
54	17	Processing	\N	2026-11-03 16:01:18.923133+00	{"ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "WorkerId": "662822f9-b74c-485e-9ae5-e3628cf67ced", "StartedAt": "2026-11-03T16:01:18.9183974Z"}	0
55	17	Failed	An exception occurred during performance of the job.	2026-11-03 16:01:18.950099+00	{"FailedAt": "2026-11-03T16:01:18.9387916Z", "ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "ExceptionType": "SixLabors.ImageSharp.UnknownImageFormatException", "ExceptionDetails": "SixLabors.ImageSharp.UnknownImageFormatException: Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n\\r\\n   at SixLabors.ImageSharp.Image.LoadWithFormatAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at SixLabors.ImageSharp.Image.LoadAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at CulinaryBlog.Infrastructure.Services.ImageProcessingService.CreateThumbnailAsync(Stream imageStream, Int32 width, Int32 height, CancellationToken ct)\\r\\n   at CulinaryBlog.Infrastructure.Jobs.RecipeImageResizeJob.ExecuteAsync(Guid recipeId, Guid imageId, String originalUrl, CancellationToken ct)\\r\\n   at System.RuntimeMethodHandle.InvokeMethod(ObjectHandleOnStack target, Void** arguments, ObjectHandleOnStack sig, BOOL isConstructor, ObjectHandleOnStack result)\\r\\n   at System.Reflection.MethodBaseInvoker.InterpretedInvoke_Method(Object obj, IntPtr* args)\\r\\n   at System.Reflection.MethodBaseInvoker.InvokeWithNoArgs(Object obj, BindingFlags invokeAttr)\\r\\n", "ExceptionMessage": "Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n"}	0
56	17	Scheduled	Retry attempt 2 of 10: Image cannot be loaded. Available decoders:\r\n - T…	2026-11-03 16:01:18.952161+00	{"EnqueueAt": "2026-11-03T16:02:12.9491979Z", "ScheduledAt": "2026-11-03T16:01:18.9491992Z"}	0
57	17	Enqueued	Triggered by DelayedJobScheduler	2026-11-03 16:02:18.983002+00	{"Queue": "default", "EnqueuedAt": "2026-11-03T16:02:18.9786925Z"}	0
58	17	Processing	\N	2026-11-03 16:02:18.993796+00	{"ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "WorkerId": "662822f9-b74c-485e-9ae5-e3628cf67ced", "StartedAt": "2026-11-03T16:02:18.9894041Z"}	0
59	17	Failed	An exception occurred during performance of the job.	2026-11-03 16:02:19.021126+00	{"FailedAt": "2026-11-03T16:02:19.0125078Z", "ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "ExceptionType": "SixLabors.ImageSharp.UnknownImageFormatException", "ExceptionDetails": "SixLabors.ImageSharp.UnknownImageFormatException: Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n\\r\\n   at SixLabors.ImageSharp.Image.LoadWithFormatAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at SixLabors.ImageSharp.Image.LoadAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at CulinaryBlog.Infrastructure.Services.ImageProcessingService.CreateThumbnailAsync(Stream imageStream, Int32 width, Int32 height, CancellationToken ct)\\r\\n   at CulinaryBlog.Infrastructure.Jobs.RecipeImageResizeJob.ExecuteAsync(Guid recipeId, Guid imageId, String originalUrl, CancellationToken ct)\\r\\n   at System.RuntimeMethodHandle.InvokeMethod(ObjectHandleOnStack target, Void** arguments, ObjectHandleOnStack sig, BOOL isConstructor, ObjectHandleOnStack result)\\r\\n   at System.Reflection.MethodBaseInvoker.InterpretedInvoke_Method(Object obj, IntPtr* args)\\r\\n   at System.Reflection.MethodBaseInvoker.InvokeWithNoArgs(Object obj, BindingFlags invokeAttr)\\r\\n", "ExceptionMessage": "Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n"}	0
60	17	Scheduled	Retry attempt 3 of 10: Image cannot be loaded. Available decoders:\r\n - T…	2026-11-03 16:02:19.022917+00	{"EnqueueAt": "2026-11-03T16:02:50.0206139Z", "ScheduledAt": "2026-11-03T16:02:19.0206174Z"}	0
480	169	Processing	\N	2026-11-20 08:15:02.66796+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "314fa7c6-6e1d-49b9-ba1f-85d3f1424ff9", "StartedAt": "2026-11-20T08:15:02.6626016Z"}	0
492	173	Processing	\N	2026-11-20 08:35:04.176121+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "3d2299f1-c179-4c44-852b-41c48cfcf0b7", "StartedAt": "2026-11-20T08:35:04.1705410Z"}	0
504	177	Processing	\N	2026-11-20 08:55:05.796353+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "f0bd8ce4-541b-494a-8578-16fc6a8e5e00", "StartedAt": "2026-11-20T08:55:05.7922236Z"}	0
516	181	Processing	\N	2026-11-20 09:15:07.360884+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "314fa7c6-6e1d-49b9-ba1f-85d3f1424ff9", "StartedAt": "2026-11-20T09:15:07.3564932Z"}	0
528	185	Processing	\N	2026-11-20 10:25:10.146234+00	{"ServerId": "laptop-9mm7mrfm:7184:4bc8574c-1ecb-4b2c-8104-65a4d6056465", "WorkerId": "0e2c4922-144f-48f1-a767-be78e022eead", "StartedAt": "2026-11-20T10:25:10.1418956Z"}	0
538	188	Succeeded	\N	2026-11-20 10:40:11.098064+00	{"Latency": "26", "SucceededAt": "2026-11-20T10:40:11.0909279Z", "PerformanceDuration": "3"}	0
551	193	Enqueued	Triggered by recurring job scheduler	2026-11-20 11:00:13.936055+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T11:00:13.9358490Z"}	0
561	196	Processing	\N	2026-11-20 11:15:07.401832+00	{"ServerId": "laptop-9mm7mrfm:4440:9a3068de-9215-4e72-98f9-6de0d8ca935b", "WorkerId": "e986511b-db7c-4e21-85d5-97c6a7cc7d57", "StartedAt": "2026-11-20T11:15:07.3868961Z"}	0
571	199	Succeeded	\N	2026-11-20 11:30:49.083948+00	{"Latency": "82", "SucceededAt": "2026-11-20T11:30:49.0698098Z", "PerformanceDuration": "116"}	0
581	203	Enqueued	Triggered by recurring job scheduler	2026-11-20 11:45:01.052626+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T11:45:01.0524012Z"}	0
593	207	Enqueued	Triggered by recurring job scheduler	2026-11-20 12:05:02.307176+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T12:05:02.3070549Z"}	0
603	210	Processing	\N	2026-11-20 12:20:03.30961+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "175a736f-5274-4be2-8f3d-2660de1932ad", "StartedAt": "2026-11-20T12:20:03.3029962Z"}	0
614	214	Enqueued	Triggered by recurring job scheduler	2026-11-20 12:40:04.972879+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T12:40:04.9727629Z"}	0
61	17	Enqueued	Triggered by DelayedJobScheduler	2026-11-03 16:03:04.047422+00	{"Queue": "default", "EnqueuedAt": "2026-11-03T16:03:04.0424310Z"}	0
62	17	Processing	\N	2026-11-03 16:03:04.059654+00	{"ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "WorkerId": "662822f9-b74c-485e-9ae5-e3628cf67ced", "StartedAt": "2026-11-03T16:03:04.0543608Z"}	0
63	17	Failed	An exception occurred during performance of the job.	2026-11-03 16:03:04.083715+00	{"FailedAt": "2026-11-03T16:03:04.0757937Z", "ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "ExceptionType": "SixLabors.ImageSharp.UnknownImageFormatException", "ExceptionDetails": "SixLabors.ImageSharp.UnknownImageFormatException: Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n\\r\\n   at SixLabors.ImageSharp.Image.LoadWithFormatAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at SixLabors.ImageSharp.Image.LoadAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at CulinaryBlog.Infrastructure.Services.ImageProcessingService.CreateThumbnailAsync(Stream imageStream, Int32 width, Int32 height, CancellationToken ct)\\r\\n   at CulinaryBlog.Infrastructure.Jobs.RecipeImageResizeJob.ExecuteAsync(Guid recipeId, Guid imageId, String originalUrl, CancellationToken ct)\\r\\n   at System.RuntimeMethodHandle.InvokeMethod(ObjectHandleOnStack target, Void** arguments, ObjectHandleOnStack sig, BOOL isConstructor, ObjectHandleOnStack result)\\r\\n   at System.Reflection.MethodBaseInvoker.InterpretedInvoke_Method(Object obj, IntPtr* args)\\r\\n   at System.Reflection.MethodBaseInvoker.InvokeWithNoArgs(Object obj, BindingFlags invokeAttr)\\r\\n", "ExceptionMessage": "Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n"}	0
64	17	Scheduled	Retry attempt 4 of 10: Image cannot be loaded. Available decoders:\r\n - T…	2026-11-03 16:03:04.085639+00	{"EnqueueAt": "2026-11-03T16:05:56.0831283Z", "ScheduledAt": "2026-11-03T16:03:04.0831292Z"}	0
65	17	Enqueued	Triggered by DelayedJobScheduler	2026-11-03 16:06:04.222878+00	{"Queue": "default", "EnqueuedAt": "2026-11-03T16:06:04.2136021Z"}	0
66	17	Processing	\N	2026-11-03 16:06:04.242766+00	{"ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "WorkerId": "eb0e7193-d192-4327-89fd-44adcdb27f67", "StartedAt": "2026-11-03T16:06:04.2351397Z"}	0
67	17	Failed	An exception occurred during performance of the job.	2026-11-03 16:06:04.290475+00	{"FailedAt": "2026-11-03T16:06:04.2776841Z", "ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "ExceptionType": "SixLabors.ImageSharp.UnknownImageFormatException", "ExceptionDetails": "SixLabors.ImageSharp.UnknownImageFormatException: Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n\\r\\n   at SixLabors.ImageSharp.Image.LoadWithFormatAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at SixLabors.ImageSharp.Image.LoadAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at CulinaryBlog.Infrastructure.Services.ImageProcessingService.CreateThumbnailAsync(Stream imageStream, Int32 width, Int32 height, CancellationToken ct)\\r\\n   at CulinaryBlog.Infrastructure.Jobs.RecipeImageResizeJob.ExecuteAsync(Guid recipeId, Guid imageId, String originalUrl, CancellationToken ct)\\r\\n   at System.RuntimeMethodHandle.InvokeMethod(ObjectHandleOnStack target, Void** arguments, ObjectHandleOnStack sig, BOOL isConstructor, ObjectHandleOnStack result)\\r\\n   at System.Reflection.MethodBaseInvoker.InterpretedInvoke_Method(Object obj, IntPtr* args)\\r\\n   at System.Reflection.MethodBaseInvoker.InvokeWithNoArgs(Object obj, BindingFlags invokeAttr)\\r\\n", "ExceptionMessage": "Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n"}	0
68	17	Scheduled	Retry attempt 5 of 10: Image cannot be loaded. Available decoders:\r\n - T…	2026-11-03 16:06:04.292288+00	{"EnqueueAt": "2026-11-03T16:12:35.2898216Z", "ScheduledAt": "2026-11-03T16:06:04.2898224Z"}	0
69	17	Enqueued	Triggered by DelayedJobScheduler	2026-11-03 16:12:49.687273+00	{"Queue": "default", "EnqueuedAt": "2026-11-03T16:12:49.6369213Z"}	0
70	17	Processing	\N	2026-11-03 16:12:49.732728+00	{"ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "WorkerId": "f0b469f3-3620-4f07-a848-3d946633ce4e", "StartedAt": "2026-11-03T16:12:49.7138413Z"}	0
71	17	Failed	An exception occurred during performance of the job.	2026-11-03 16:12:49.876159+00	{"FailedAt": "2026-11-03T16:12:49.8636173Z", "ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "ExceptionType": "SixLabors.ImageSharp.UnknownImageFormatException", "ExceptionDetails": "SixLabors.ImageSharp.UnknownImageFormatException: Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n\\r\\n   at SixLabors.ImageSharp.Image.LoadWithFormatAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at SixLabors.ImageSharp.Image.LoadAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at CulinaryBlog.Infrastructure.Services.ImageProcessingService.CreateThumbnailAsync(Stream imageStream, Int32 width, Int32 height, CancellationToken ct)\\r\\n   at CulinaryBlog.Infrastructure.Jobs.RecipeImageResizeJob.ExecuteAsync(Guid recipeId, Guid imageId, String originalUrl, CancellationToken ct)\\r\\n   at System.RuntimeMethodHandle.InvokeMethod(ObjectHandleOnStack target, Void** arguments, ObjectHandleOnStack sig, BOOL isConstructor, ObjectHandleOnStack result)\\r\\n   at System.Reflection.MethodBaseInvoker.InterpretedInvoke_Method(Object obj, IntPtr* args)\\r\\n   at System.Reflection.MethodBaseInvoker.InvokeWithNoArgs(Object obj, BindingFlags invokeAttr)\\r\\n", "ExceptionMessage": "Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n"}	0
72	17	Scheduled	Retry attempt 6 of 10: Image cannot be loaded. Available decoders:\r\n - T…	2026-11-03 16:12:49.880353+00	{"EnqueueAt": "2026-11-03T16:23:35.8738731Z", "ScheduledAt": "2026-11-03T16:12:49.8738740Z"}	0
73	17	Enqueued	Triggered by DelayedJobScheduler	2026-11-03 16:23:35.424979+00	{"Queue": "default", "EnqueuedAt": "2026-11-03T16:23:35.3825749Z"}	0
74	17	Processing	\N	2026-11-03 16:23:35.452246+00	{"ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "WorkerId": "2c866ae0-78f4-4339-9e8a-d5e2f0d1f9d6", "StartedAt": "2026-11-03T16:23:35.4447468Z"}	0
481	169	Succeeded	\N	2026-11-20 08:15:02.71436+00	{"Latency": "31", "SucceededAt": "2026-11-20T08:15:02.6768476Z", "PerformanceDuration": "4"}	0
493	173	Succeeded	\N	2026-11-20 08:35:04.193035+00	{"Latency": "25", "SucceededAt": "2026-11-20T08:35:04.1855008Z", "PerformanceDuration": "3"}	0
75	17	Failed	An exception occurred during performance of the job.	2026-11-03 16:23:35.55615+00	{"FailedAt": "2026-11-03T16:23:35.5454934Z", "ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "ExceptionType": "SixLabors.ImageSharp.UnknownImageFormatException", "ExceptionDetails": "SixLabors.ImageSharp.UnknownImageFormatException: Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n\\r\\n   at SixLabors.ImageSharp.Image.LoadWithFormatAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at SixLabors.ImageSharp.Image.LoadAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at CulinaryBlog.Infrastructure.Services.ImageProcessingService.CreateThumbnailAsync(Stream imageStream, Int32 width, Int32 height, CancellationToken ct)\\r\\n   at CulinaryBlog.Infrastructure.Jobs.RecipeImageResizeJob.ExecuteAsync(Guid recipeId, Guid imageId, String originalUrl, CancellationToken ct)\\r\\n   at System.RuntimeMethodHandle.InvokeMethod(ObjectHandleOnStack target, Void** arguments, ObjectHandleOnStack sig, BOOL isConstructor, ObjectHandleOnStack result)\\r\\n   at System.Reflection.MethodBaseInvoker.InterpretedInvoke_Method(Object obj, IntPtr* args)\\r\\n   at System.Reflection.MethodBaseInvoker.InvokeWithNoArgs(Object obj, BindingFlags invokeAttr)\\r\\n", "ExceptionMessage": "Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n"}	0
76	17	Scheduled	Retry attempt 7 of 10: Image cannot be loaded. Available decoders:\r\n - T…	2026-11-03 16:23:35.565499+00	{"EnqueueAt": "2026-11-03T16:48:28.5545618Z", "ScheduledAt": "2026-11-03T16:23:35.5545623Z"}	0
77	17	Enqueued	Triggered by DelayedJobScheduler	2026-11-03 16:48:37.068831+00	{"Queue": "default", "EnqueuedAt": "2026-11-03T16:48:37.0387773Z"}	0
78	17	Processing	\N	2026-11-03 16:48:37.091426+00	{"ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "WorkerId": "95720310-7428-425e-892a-74a79ee8f015", "StartedAt": "2026-11-03T16:48:37.0867263Z"}	0
79	17	Failed	An exception occurred during performance of the job.	2026-11-03 16:48:37.191197+00	{"FailedAt": "2026-11-03T16:48:37.1811738Z", "ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "ExceptionType": "SixLabors.ImageSharp.UnknownImageFormatException", "ExceptionDetails": "SixLabors.ImageSharp.UnknownImageFormatException: Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n\\r\\n   at SixLabors.ImageSharp.Image.LoadWithFormatAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at SixLabors.ImageSharp.Image.LoadAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at CulinaryBlog.Infrastructure.Services.ImageProcessingService.CreateThumbnailAsync(Stream imageStream, Int32 width, Int32 height, CancellationToken ct)\\r\\n   at CulinaryBlog.Infrastructure.Jobs.RecipeImageResizeJob.ExecuteAsync(Guid recipeId, Guid imageId, String originalUrl, CancellationToken ct)\\r\\n   at System.RuntimeMethodHandle.InvokeMethod(ObjectHandleOnStack target, Void** arguments, ObjectHandleOnStack sig, BOOL isConstructor, ObjectHandleOnStack result)\\r\\n   at System.Reflection.MethodBaseInvoker.InterpretedInvoke_Method(Object obj, IntPtr* args)\\r\\n   at System.Reflection.MethodBaseInvoker.InvokeWithNoArgs(Object obj, BindingFlags invokeAttr)\\r\\n", "ExceptionMessage": "Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n"}	0
80	17	Scheduled	Retry attempt 8 of 10: Image cannot be loaded. Available decoders:\r\n - T…	2026-11-03 16:48:37.194916+00	{"EnqueueAt": "2026-11-03T17:30:05.1894275Z", "ScheduledAt": "2026-11-03T16:48:37.1894285Z"}	0
81	17	Enqueued	Triggered by DelayedJobScheduler	2026-11-03 17:30:09.765801+00	{"Queue": "default", "EnqueuedAt": "2026-11-03T17:30:09.7418428Z"}	0
82	17	Processing	\N	2026-11-03 17:30:09.78809+00	{"ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "WorkerId": "ed190cc8-2e3f-4bda-9dd8-d8d3136ddadb", "StartedAt": "2026-11-03T17:30:09.7829565Z"}	0
83	17	Failed	An exception occurred during performance of the job.	2026-11-03 17:30:09.872392+00	{"FailedAt": "2026-11-03T17:30:09.8639533Z", "ServerId": "laptop-9mm7mrfm:10032:d174a6e1-097f-4e14-8731-deccd48289ef", "ExceptionType": "SixLabors.ImageSharp.UnknownImageFormatException", "ExceptionDetails": "SixLabors.ImageSharp.UnknownImageFormatException: Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n\\r\\n   at SixLabors.ImageSharp.Image.LoadWithFormatAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at SixLabors.ImageSharp.Image.LoadAsync(Configuration configuration, Stream stream, CancellationToken cancellationToken)\\r\\n   at CulinaryBlog.Infrastructure.Services.ImageProcessingService.CreateThumbnailAsync(Stream imageStream, Int32 width, Int32 height, CancellationToken ct)\\r\\n   at CulinaryBlog.Infrastructure.Jobs.RecipeImageResizeJob.ExecuteAsync(Guid recipeId, Guid imageId, String originalUrl, CancellationToken ct)\\r\\n   at System.RuntimeMethodHandle.InvokeMethod(ObjectHandleOnStack target, Void** arguments, ObjectHandleOnStack sig, BOOL isConstructor, ObjectHandleOnStack result)\\r\\n   at System.Reflection.MethodBaseInvoker.InterpretedInvoke_Method(Object obj, IntPtr* args)\\r\\n   at System.Reflection.MethodBaseInvoker.InvokeWithNoArgs(Object obj, BindingFlags invokeAttr)\\r\\n", "ExceptionMessage": "Image cannot be loaded. Available decoders:\\r\\n - TIFF : TiffDecoder\\r\\n - GIF : GifDecoder\\r\\n - Webp : WebpDecoder\\r\\n - PBM : PbmDecoder\\r\\n - BMP : BmpDecoder\\r\\n - PNG : PngDecoder\\r\\n - JPEG : JpegDecoder\\r\\n - TGA : TgaDecoder\\r\\n"}	0
84	17	Scheduled	Retry attempt 9 of 10: Image cannot be loaded. Available decoders:\r\n - T…	2026-11-03 17:30:09.874623+00	{"EnqueueAt": "2026-11-03T18:42:16.8715064Z", "ScheduledAt": "2026-11-03T17:30:09.8715069Z"}	0
85	17	Enqueued	Triggered by DelayedJobScheduler	2026-11-04 01:14:55.266252+00	{"Queue": "default", "EnqueuedAt": "2026-11-04T01:14:55.0663733Z"}	0
86	17	Processing	\N	2026-11-04 01:14:55.320113+00	{"ServerId": "laptop-9mm7mrfm:7660:92920775-19f8-478a-8da1-be7b823a35a4", "WorkerId": "028f7e0c-e139-42c0-a1c0-84d3a7123d0c", "StartedAt": "2026-11-04T01:14:55.3084979Z"}	0
482	170	Enqueued	Triggered by recurring job scheduler	2026-11-20 08:20:03.01295+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T08:20:03.0128292Z"}	0
494	174	Enqueued	Triggered by recurring job scheduler	2026-11-20 08:40:04.514928+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T08:40:04.5148006Z"}	0
505	177	Succeeded	\N	2026-11-20 08:55:05.810926+00	{"Latency": "24", "SucceededAt": "2026-11-20T08:55:05.8044841Z", "PerformanceDuration": "2"}	0
517	181	Succeeded	\N	2026-11-20 09:15:07.375623+00	{"Latency": "23", "SucceededAt": "2026-11-20T09:15:07.3687503Z", "PerformanceDuration": "2"}	0
87	17	Failed	An exception occurred during performance of the job.	2026-11-04 01:14:55.478511+00	{"FailedAt": "2026-11-04T01:14:55.4388658Z", "ServerId": "laptop-9mm7mrfm:7660:92920775-19f8-478a-8da1-be7b823a35a4", "ExceptionType": "CulinaryBlog.Application.Common.Exceptions.AppException", "ExceptionDetails": "CulinaryBlog.Application.Common.Exceptions.AppException: Không thể tải tệp tin từ MinIO: recipes/9ac2d166-8bf3-41fe-8576-dbd38291633d/202c216c-bc96-4fb2-8a1e-53f02100c133.jpg\\r\\n   at CulinaryBlog.Infrastructure.Services.MinioFileStorageService.GetStreamAsync(String fileUrl, CancellationToken ct)\\r\\n   at CulinaryBlog.Infrastructure.Jobs.RecipeImageResizeJob.ExecuteAsync(Guid recipeId, Guid imageId, String originalUrl, CancellationToken ct)\\r\\n   at System.Reflection.MethodBaseInvoker.InterpretedInvoke_Method(Object obj, IntPtr* args)\\r\\n   at System.Reflection.MethodBaseInvoker.InvokeWithNoArgs(Object obj, BindingFlags invokeAttr)\\r\\n", "ExceptionMessage": "Không thể tải tệp tin từ MinIO: recipes/9ac2d166-8bf3-41fe-8576-dbd38291633d/202c216c-bc96-4fb2-8a1e-53f02100c133.jpg"}	0
88	17	Scheduled	Retry attempt 10 of 10: Không thể tải tệp tin từ MinIO: recipes/9ac2d166-…	2026-11-04 01:14:55.492224+00	{"EnqueueAt": "2026-11-04T03:06:11.4753326Z", "ScheduledAt": "2026-11-04T01:14:55.4754590Z"}	0
483	170	Processing	\N	2026-11-20 08:20:03.02796+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "899f8a8c-72c3-4ae3-8d08-1845052be1d6", "StartedAt": "2026-11-20T08:20:03.0237170Z"}	0
495	174	Processing	\N	2026-11-20 08:40:04.531733+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "14c9cd42-33a9-4e3e-8bbd-8cfcceccdb01", "StartedAt": "2026-11-20T08:40:04.5266367Z"}	0
506	178	Enqueued	Triggered by recurring job scheduler	2026-11-20 09:00:06.226342+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T09:00:06.2262063Z"}	0
92	17	Enqueued	Triggered by DelayedJobScheduler	2026-11-04 03:06:16.602284+00	{"Queue": "default", "EnqueuedAt": "2026-11-04T03:06:16.5020542Z"}	0
93	17	Processing	\N	2026-11-04 03:06:16.63735+00	{"ServerId": "laptop-9mm7mrfm:9728:37ebff14-b1e5-4737-bf9c-4652848d44c2", "WorkerId": "10471b42-9dcd-4bd3-8ecc-b0b665c217fc", "StartedAt": "2026-11-04T03:06:16.6311612Z"}	0
94	17	Failed	An exception occurred during performance of the job.	2026-11-04 03:06:16.735621+00	{"FailedAt": "2026-11-04T03:06:16.7188383Z", "ServerId": "laptop-9mm7mrfm:9728:37ebff14-b1e5-4737-bf9c-4652848d44c2", "ExceptionType": "CulinaryBlog.Application.Common.Exceptions.AppException", "ExceptionDetails": "CulinaryBlog.Application.Common.Exceptions.AppException: Không thể tải tệp tin từ MinIO: recipes/9ac2d166-8bf3-41fe-8576-dbd38291633d/202c216c-bc96-4fb2-8a1e-53f02100c133.jpg\\r\\n   at CulinaryBlog.Infrastructure.Services.MinioFileStorageService.GetStreamAsync(String fileUrl, CancellationToken ct)\\r\\n   at CulinaryBlog.Infrastructure.Jobs.RecipeImageResizeJob.ExecuteAsync(Guid recipeId, Guid imageId, String originalUrl, CancellationToken ct)\\r\\n   at System.RuntimeMethodHandle.InvokeMethod(ObjectHandleOnStack target, Void** arguments, ObjectHandleOnStack sig, BOOL isConstructor, ObjectHandleOnStack result)\\r\\n   at System.Reflection.MethodBaseInvoker.InterpretedInvoke_Method(Object obj, IntPtr* args)\\r\\n   at System.Reflection.MethodBaseInvoker.InvokeWithNoArgs(Object obj, BindingFlags invokeAttr)\\r\\n", "ExceptionMessage": "Không thể tải tệp tin từ MinIO: recipes/9ac2d166-8bf3-41fe-8576-dbd38291633d/202c216c-bc96-4fb2-8a1e-53f02100c133.jpg"}	0
518	182	Enqueued	Triggered by recurring job scheduler	2026-11-20 10:14:39.418173+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T10:14:39.4099693Z"}	0
529	185	Succeeded	\N	2026-11-20 10:25:10.162865+00	{"Latency": "27", "SucceededAt": "2026-11-20T10:25:10.1562880Z", "PerformanceDuration": "3"}	0
539	189	Enqueued	Triggered by recurring job scheduler	2026-11-20 10:45:27.99796+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T10:45:27.9899426Z"}	0
546	191	Processing	\N	2026-11-20 10:50:14.088844+00	{"ServerId": "laptop-9mm7mrfm:11884:aab2e2a5-f6d5-47eb-970b-3e9b42ce32ae", "WorkerId": "e4bc41f0-ec05-437e-bed9-8ff43a5bd245", "StartedAt": "2026-11-20T10:50:14.0830848Z"}	0
552	193	Processing	\N	2026-11-20 11:00:13.960242+00	{"ServerId": "laptop-9mm7mrfm:11884:aab2e2a5-f6d5-47eb-970b-3e9b42ce32ae", "WorkerId": "8048068b-1b63-46e9-8a0b-f2b66e6b5d09", "StartedAt": "2026-11-20T11:00:13.9514723Z"}	0
562	196	Succeeded	\N	2026-11-20 11:15:07.455015+00	{"Latency": "85", "SucceededAt": "2026-11-20T11:15:07.4404370Z", "PerformanceDuration": "30"}	0
572	200	Enqueued	Triggered by recurring job scheduler	2026-11-20 11:39:24.16219+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T11:39:24.1536063Z"}	0
582	203	Processing	\N	2026-11-20 11:45:01.067106+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "9d6c93f9-c93c-4fba-80e8-750fa38e89aa", "StartedAt": "2026-11-20T11:45:01.0626413Z"}	0
594	207	Processing	\N	2026-11-20 12:05:02.322269+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "3a9129ff-ddb1-4088-8058-d22fc0a8b70d", "StartedAt": "2026-11-20T12:05:02.3176871Z"}	0
604	210	Succeeded	\N	2026-11-20 12:20:03.32773+00	{"Latency": "34", "SucceededAt": "2026-11-20T12:20:03.3199158Z", "PerformanceDuration": "3"}	0
616	214	Succeeded	\N	2026-11-20 12:40:05.005655+00	{"Latency": "29", "SucceededAt": "2026-11-20T12:40:04.9978457Z", "PerformanceDuration": "3"}	0
484	170	Succeeded	\N	2026-11-20 08:20:03.077668+00	{"Latency": "26", "SucceededAt": "2026-11-20T08:20:03.0703337Z", "PerformanceDuration": "36"}	0
496	174	Succeeded	\N	2026-11-20 08:40:04.551598+00	{"Latency": "32", "SucceededAt": "2026-11-20T08:40:04.5438596Z", "PerformanceDuration": "4"}	0
507	178	Processing	\N	2026-11-20 09:00:06.243412+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "52d063d1-3509-44d3-966b-49e1c7b19921", "StartedAt": "2026-11-20T09:00:06.2371512Z"}	0
519	182	Processing	\N	2026-11-20 10:14:39.471132+00	{"ServerId": "laptop-9mm7mrfm:7184:4bc8574c-1ecb-4b2c-8104-65a4d6056465", "WorkerId": "b3128584-022c-4a2e-af7f-2cc067f07b43", "StartedAt": "2026-11-20T10:14:39.4531577Z"}	0
530	186	Enqueued	Triggered by recurring job scheduler	2026-11-20 10:30:10.451097+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T10:30:10.4509833Z"}	0
540	189	Processing	\N	2026-11-20 10:45:28.033965+00	{"ServerId": "laptop-9mm7mrfm:11884:aab2e2a5-f6d5-47eb-970b-3e9b42ce32ae", "WorkerId": "016bbc22-e7bf-4d40-b8b7-5ebb72e88539", "StartedAt": "2026-11-20T10:45:28.0215264Z"}	0
553	193	Succeeded	\N	2026-11-20 11:00:13.994759+00	{"Latency": "44", "SucceededAt": "2026-11-20T11:00:13.9741460Z", "PerformanceDuration": "5"}	0
563	197	Enqueued	Triggered by recurring job scheduler	2026-11-20 11:20:07.723907+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T11:20:07.7237017Z"}	0
573	200	Processing	\N	2026-11-20 11:39:24.200607+00	{"ServerId": "laptop-9mm7mrfm:2696:1b8e99dc-73c8-4354-99e8-0ee2135303ab", "WorkerId": "7276c46c-024c-4650-b488-fd4879c9f7e8", "StartedAt": "2026-11-20T11:39:24.1863427Z"}	0
583	203	Succeeded	\N	2026-11-20 11:45:01.085208+00	{"Latency": "25", "SucceededAt": "2026-11-20T11:45:01.0773235Z", "PerformanceDuration": "4"}	0
595	207	Succeeded	\N	2026-11-20 12:05:02.338344+00	{"Latency": "27", "SucceededAt": "2026-11-20T12:05:02.3316718Z", "PerformanceDuration": "3"}	0
605	211	Enqueued	Triggered by recurring job scheduler	2026-11-20 12:25:03.717025+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T12:25:03.7168030Z"}	0
617	215	Enqueued	Triggered by recurring job scheduler	2026-11-20 12:45:05.359114+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T12:45:05.3558696Z"}	0
485	171	Enqueued	Triggered by recurring job scheduler	2026-11-20 08:25:03.373149+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T08:25:03.3729683Z"}	0
497	175	Enqueued	Triggered by recurring job scheduler	2026-11-20 08:45:04.868152+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T08:45:04.8676330Z"}	0
508	178	Succeeded	\N	2026-11-20 09:00:06.262644+00	{"Latency": "33", "SucceededAt": "2026-11-20T09:00:06.2540396Z", "PerformanceDuration": "3"}	0
520	182	Succeeded	\N	2026-11-20 10:14:39.709931+00	{"Latency": "100", "SucceededAt": "2026-11-20T10:14:39.6946581Z", "PerformanceDuration": "212"}	0
522	183	Processing	\N	2026-11-20 10:15:09.521502+00	{"ServerId": "laptop-9mm7mrfm:7184:4bc8574c-1ecb-4b2c-8104-65a4d6056465", "WorkerId": "b3128584-022c-4a2e-af7f-2cc067f07b43", "StartedAt": "2026-11-20T10:15:09.5167379Z"}	0
531	186	Processing	\N	2026-11-20 10:30:10.466406+00	{"ServerId": "laptop-9mm7mrfm:7184:4bc8574c-1ecb-4b2c-8104-65a4d6056465", "WorkerId": "6c889df6-65ec-4e62-a736-837aa2018b9c", "StartedAt": "2026-11-20T10:30:10.4612913Z"}	0
541	189	Succeeded	\N	2026-11-20 10:45:28.227344+00	{"Latency": "71", "SucceededAt": "2026-11-20T10:45:28.2142335Z", "PerformanceDuration": "173"}	0
545	191	Enqueued	\N	2026-11-20 10:50:14.07552+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T10:50:14.0658741Z"}	0
554	194	Enqueued	Triggered by recurring job scheduler	2026-11-20 11:05:06.957052+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T11:05:06.9488724Z"}	0
564	197	Processing	\N	2026-11-20 11:20:07.740591+00	{"ServerId": "laptop-9mm7mrfm:4440:9a3068de-9215-4e72-98f9-6de0d8ca935b", "WorkerId": "d9c95ef9-5938-4d0d-96ea-62bf28be3622", "StartedAt": "2026-11-20T11:20:07.7350896Z"}	0
574	200	Succeeded	\N	2026-11-20 11:39:24.332255+00	{"Latency": "74", "SucceededAt": "2026-11-20T11:39:24.3199559Z", "PerformanceDuration": "111"}	0
584	204	Enqueued	Triggered by recurring job scheduler	2026-11-20 11:50:01.381145+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T11:50:01.3810246Z"}	0
596	208	Enqueued	Triggered by recurring job scheduler	2026-11-20 12:10:02.648238+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T12:10:02.6481197Z"}	0
606	211	Processing	\N	2026-11-20 12:25:03.774298+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "fe549c96-f389-475b-b9e6-8b58ad2a6922", "StartedAt": "2026-11-20T12:25:03.7599911Z"}	0
470	166	Enqueued	Triggered by recurring job scheduler	2026-11-20 08:13:02.417757+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T08:13:02.4079851Z"}	0
471	167	Enqueued	Triggered by recurring job scheduler	2026-11-20 08:13:02.454224+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T08:13:02.4539045Z"}	0
474	168	Enqueued	Triggered by recurring job scheduler	2026-11-20 08:13:02.475962+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T08:13:02.4758319Z"}	0
618	215	Processing	\N	2026-11-20 12:45:05.40673+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "c342857a-d22e-4858-956f-03cbc9ea6b55", "StartedAt": "2026-11-20T12:45:05.3911747Z"}	0
486	171	Processing	\N	2026-11-20 08:25:03.394125+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "76dc0a56-c23c-4b64-aca0-869efc9460f5", "StartedAt": "2026-11-20T08:25:03.3866061Z"}	0
498	175	Processing	\N	2026-11-20 08:45:04.883035+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "457c78f9-30ea-48b3-a240-8ece582cfeeb", "StartedAt": "2026-11-20T08:45:04.8778283Z"}	0
509	179	Enqueued	Triggered by recurring job scheduler	2026-11-20 09:05:06.6658+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T09:05:06.6656873Z"}	0
521	183	Enqueued	Triggered by recurring job scheduler	2026-11-20 10:15:09.5044+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T10:15:09.5038956Z"}	0
532	186	Succeeded	\N	2026-11-20 10:30:10.484603+00	{"Latency": "28", "SucceededAt": "2026-11-20T10:30:10.4774420Z", "PerformanceDuration": "3"}	0
542	190	Enqueued	Triggered by recurring job scheduler	2026-11-20 10:50:13.335476+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T10:50:13.3352912Z"}	0
547	191	Succeeded	\N	2026-11-20 10:50:14.804742+00	{"Latency": "25", "SucceededAt": "2026-11-20T10:50:14.7957700Z", "PerformanceDuration": "701"}	0
555	194	Processing	\N	2026-11-20 11:05:06.991383+00	{"ServerId": "laptop-9mm7mrfm:13584:2b822d82-4584-46b8-b732-a00313ae5b8a", "WorkerId": "e6132c08-cfef-46c3-a577-c5220ae8bacf", "StartedAt": "2026-11-20T11:05:06.9794259Z"}	0
565	197	Succeeded	\N	2026-11-20 11:20:07.759372+00	{"Latency": "29", "SucceededAt": "2026-11-20T11:20:07.7518428Z", "PerformanceDuration": "4"}	0
575	201	Enqueued	\N	2026-11-20 11:39:36.258332+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T11:39:36.2252510Z"}	0
585	204	Processing	\N	2026-11-20 11:50:01.397154+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "dc933cbd-ffdb-48c3-860c-c4cbdfbae2ea", "StartedAt": "2026-11-20T11:50:01.3918228Z"}	0
597	208	Processing	\N	2026-11-20 12:10:02.663396+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "12e185df-b1c7-4af0-8196-7036567b4faa", "StartedAt": "2026-11-20T12:10:02.6585658Z"}	0
607	211	Succeeded	\N	2026-11-20 12:25:03.903624+00	{"Latency": "223", "SucceededAt": "2026-11-20T12:25:03.8719163Z", "PerformanceDuration": "8"}	0
619	215	Succeeded	\N	2026-11-20 12:45:05.459642+00	{"Latency": "111", "SucceededAt": "2026-11-20T12:45:05.4445160Z", "PerformanceDuration": "21"}	0
472	166	Processing	\N	2026-11-20 08:13:02.468389+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "314fa7c6-6e1d-49b9-ba1f-85d3f1424ff9", "StartedAt": "2026-11-20T08:13:02.4504432Z"}	0
487	171	Succeeded	\N	2026-11-20 08:25:03.414159+00	{"Latency": "40", "SucceededAt": "2026-11-20T08:25:03.4070175Z", "PerformanceDuration": "3"}	0
499	175	Succeeded	\N	2026-11-20 08:45:04.902533+00	{"Latency": "29", "SucceededAt": "2026-11-20T08:45:04.8949593Z", "PerformanceDuration": "4"}	0
510	179	Processing	\N	2026-11-20 09:05:06.679674+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "d4484283-a59e-4dd5-a80e-8254dff75b4c", "StartedAt": "2026-11-20T09:05:06.6753398Z"}	0
511	179	Succeeded	\N	2026-11-20 09:05:06.713674+00	{"Latency": "27", "SucceededAt": "2026-11-20T09:05:06.7068386Z", "PerformanceDuration": "19"}	0
523	183	Succeeded	\N	2026-11-20 10:15:09.540671+00	{"Latency": "29", "SucceededAt": "2026-11-20T10:15:09.5317358Z", "PerformanceDuration": "5"}	0
533	187	Enqueued	Triggered by recurring job scheduler	2026-11-20 10:35:10.755587+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T10:35:10.7554658Z"}	0
543	190	Processing	\N	2026-11-20 10:50:13.351924+00	{"ServerId": "laptop-9mm7mrfm:11884:aab2e2a5-f6d5-47eb-970b-3e9b42ce32ae", "WorkerId": "016bbc22-e7bf-4d40-b8b7-5ebb72e88539", "StartedAt": "2026-11-20T10:50:13.3456032Z"}	0
556	194	Succeeded	\N	2026-11-20 11:05:07.035348+00	{"Latency": "68", "SucceededAt": "2026-11-20T11:05:07.0225566Z", "PerformanceDuration": "23"}	0
566	198	Enqueued	Triggered by recurring job scheduler	2026-11-20 11:25:21.465356+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T11:25:21.4568025Z"}	0
576	201	Processing	\N	2026-11-20 11:39:36.319329+00	{"ServerId": "laptop-9mm7mrfm:3512:f58de6af-1369-4f0f-8ebb-5f0657be43c8", "WorkerId": "61eb83f9-0a83-44f3-9ff4-f8faa7a7af14", "StartedAt": "2026-11-20T11:39:36.2779130Z"}	0
586	204	Succeeded	\N	2026-11-20 11:50:01.416908+00	{"Latency": "32", "SucceededAt": "2026-11-20T11:50:01.4093935Z", "PerformanceDuration": "4"}	0
598	208	Succeeded	\N	2026-11-20 12:10:02.678636+00	{"Latency": "26", "SucceededAt": "2026-11-20T12:10:02.6715551Z", "PerformanceDuration": "3"}	0
608	212	Enqueued	Triggered by recurring job scheduler	2026-11-20 12:30:04.150603+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T12:30:04.1494950Z"}	0
620	216	Enqueued	Triggered by recurring job scheduler	2026-11-20 12:50:05.67563+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T12:50:05.6737223Z"}	0
473	167	Processing	\N	2026-11-20 08:13:02.474087+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "76dc0a56-c23c-4b64-aca0-869efc9460f5", "StartedAt": "2026-11-20T08:13:02.4668652Z"}	0
488	172	Enqueued	Triggered by recurring job scheduler	2026-11-20 08:30:03.772334+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T08:30:03.7722134Z"}	0
500	176	Enqueued	Triggered by recurring job scheduler	2026-11-20 08:50:05.422334+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T08:50:05.4219033Z"}	0
512	180	Enqueued	Triggered by recurring job scheduler	2026-11-20 09:10:07.042829+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T09:10:07.0427417Z"}	0
524	184	Enqueued	Triggered by recurring job scheduler	2026-11-20 10:20:09.80345+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T10:20:09.8033530Z"}	0
534	187	Processing	\N	2026-11-20 10:35:10.771532+00	{"ServerId": "laptop-9mm7mrfm:7184:4bc8574c-1ecb-4b2c-8104-65a4d6056465", "WorkerId": "36fd382d-4765-41f5-bb1d-0d89a3b327d4", "StartedAt": "2026-11-20T10:35:10.7664004Z"}	0
544	190	Succeeded	\N	2026-11-20 10:50:13.370605+00	{"Latency": "30", "SucceededAt": "2026-11-20T10:50:13.3630940Z", "PerformanceDuration": "5"}	0
557	195	Enqueued	Triggered by recurring job scheduler	2026-11-20 11:10:07.278778+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T11:10:07.2785858Z"}	0
567	198	Processing	\N	2026-11-20 11:25:21.507161+00	{"ServerId": "laptop-9mm7mrfm:6164:32f03705-d90d-47b6-ae2e-d070c12d7055", "WorkerId": "8d4261b2-4ded-4abd-9183-c5759bd90899", "StartedAt": "2026-11-20T11:25:21.4945645Z"}	0
577	201	Succeeded	\N	2026-11-20 11:39:36.536152+00	{"Latency": "93", "SucceededAt": "2026-11-20T11:39:36.5209933Z", "PerformanceDuration": "194"}	0
587	205	Enqueued	Triggered by recurring job scheduler	2026-11-20 11:55:01.709193+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T11:55:01.7091012Z"}	0
599	209	Enqueued	Triggered by recurring job scheduler	2026-11-20 12:15:02.970501+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T12:15:02.9704027Z"}	0
609	212	Processing	\N	2026-11-20 12:30:04.185942+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "118d0de2-29d7-4fa4-a008-82cee5deb676", "StartedAt": "2026-11-20T12:30:04.1762121Z"}	0
621	216	Processing	\N	2026-11-20 12:50:05.692046+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "d2dfffa5-5650-4e37-82d9-2833271b549c", "StartedAt": "2026-11-20T12:50:05.6870812Z"}	0
475	168	Processing	\N	2026-11-20 08:13:02.499039+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "899f8a8c-72c3-4ae3-8d08-1845052be1d6", "StartedAt": "2026-11-20T08:13:02.4892239Z"}	0
489	172	Processing	\N	2026-11-20 08:30:03.78705+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "d45f7560-be1d-4d7e-af32-3d92291f5126", "StartedAt": "2026-11-20T08:30:03.7822316Z"}	0
501	176	Processing	\N	2026-11-20 08:50:05.437794+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "a2ae9264-d861-457e-b0fb-68da0723022f", "StartedAt": "2026-11-20T08:50:05.4332378Z"}	0
513	180	Processing	\N	2026-11-20 09:10:07.056907+00	{"ServerId": "laptop-9mm7mrfm:19260:ad4685ff-8c44-4b16-b9dc-f5cd4944462f", "WorkerId": "8eb4720d-1b54-4278-b6a1-0387660b19c9", "StartedAt": "2026-11-20T09:10:07.0521548Z"}	0
525	184	Processing	\N	2026-11-20 10:20:09.818218+00	{"ServerId": "laptop-9mm7mrfm:7184:4bc8574c-1ecb-4b2c-8104-65a4d6056465", "WorkerId": "90e68835-f59c-411e-922c-01af99fd2630", "StartedAt": "2026-11-20T10:20:09.8132611Z"}	0
535	187	Succeeded	\N	2026-11-20 10:35:10.789594+00	{"Latency": "28", "SucceededAt": "2026-11-20T10:35:10.7813693Z", "PerformanceDuration": "3"}	0
548	192	Enqueued	Triggered by recurring job scheduler	2026-11-20 10:55:13.628744+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T10:55:13.6286139Z"}	0
558	195	Processing	\N	2026-11-20 11:10:07.293638+00	{"ServerId": "laptop-9mm7mrfm:13584:2b822d82-4584-46b8-b732-a00313ae5b8a", "WorkerId": "bb7b47e2-9deb-4c6f-85fd-393d4bc7cf0a", "StartedAt": "2026-11-20T11:10:07.2892141Z"}	0
568	198	Succeeded	\N	2026-11-20 11:25:21.639134+00	{"Latency": "86", "SucceededAt": "2026-11-20T11:25:21.6251837Z", "PerformanceDuration": "109"}	0
578	202	Enqueued	Triggered by recurring job scheduler	2026-11-20 11:40:30.742523+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T11:40:30.7331284Z"}	0
588	205	Processing	\N	2026-11-20 11:55:01.722885+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "e04efd43-484d-47ab-ba3b-72ad65d41171", "StartedAt": "2026-11-20T11:55:01.7188088Z"}	0
591	206	Processing	\N	2026-11-20 12:00:02.0174+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "275ae058-091e-4c82-85b8-90bf3f513329", "StartedAt": "2026-11-20T12:00:02.0133193Z"}	0
600	209	Processing	\N	2026-11-20 12:15:02.985075+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "96686da8-ac80-4981-90d1-d5e738804cc6", "StartedAt": "2026-11-20T12:15:02.9803964Z"}	0
610	212	Succeeded	\N	2026-11-20 12:30:04.24821+00	{"Latency": "82", "SucceededAt": "2026-11-20T12:30:04.2293171Z", "PerformanceDuration": "26"}	0
622	216	Succeeded	\N	2026-11-20 12:50:05.712086+00	{"Latency": "33", "SucceededAt": "2026-11-20T12:50:05.7026982Z", "PerformanceDuration": "4"}	0
476	166	Succeeded	\N	2026-11-20 08:13:02.675748+00	{"Latency": "101", "SucceededAt": "2026-11-20T08:13:02.6560384Z", "PerformanceDuration": "173"}	0
490	172	Succeeded	\N	2026-11-20 08:30:03.802467+00	{"Latency": "26", "SucceededAt": "2026-11-20T08:30:03.7953454Z", "PerformanceDuration": "2"}	0
502	176	Succeeded	\N	2026-11-20 08:50:05.456267+00	{"Latency": "27", "SucceededAt": "2026-11-20T08:50:05.4482316Z", "PerformanceDuration": "4"}	0
514	180	Succeeded	\N	2026-11-20 09:10:07.072748+00	{"Latency": "25", "SucceededAt": "2026-11-20T09:10:07.0649181Z", "PerformanceDuration": "2"}	0
526	184	Succeeded	\N	2026-11-20 10:20:09.837402+00	{"Latency": "27", "SucceededAt": "2026-11-20T10:20:09.8294426Z", "PerformanceDuration": "4"}	0
536	188	Enqueued	Triggered by recurring job scheduler	2026-11-20 10:40:11.067253+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T10:40:11.0671467Z"}	0
549	192	Processing	\N	2026-11-20 10:55:13.648755+00	{"ServerId": "laptop-9mm7mrfm:11884:aab2e2a5-f6d5-47eb-970b-3e9b42ce32ae", "WorkerId": "e4bc41f0-ec05-437e-bed9-8ff43a5bd245", "StartedAt": "2026-11-20T10:55:13.6428812Z"}	0
559	195	Succeeded	\N	2026-11-20 11:10:07.312061+00	{"Latency": "32", "SucceededAt": "2026-11-20T11:10:07.3035018Z", "PerformanceDuration": "4"}	0
569	199	Enqueued	Triggered by recurring job scheduler	2026-11-20 11:30:48.90322+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T11:30:48.8943622Z"}	0
579	202	Processing	\N	2026-11-20 11:40:30.786301+00	{"ServerId": "laptop-9mm7mrfm:16776:44e92d8a-1d4e-4c49-89a7-e7b0dfb93266", "WorkerId": "9d6c93f9-c93c-4fba-80e8-750fa38e89aa", "StartedAt": "2026-11-20T11:40:30.7714429Z"}	0
589	205	Succeeded	\N	2026-11-20 11:55:01.737575+00	{"Latency": "24", "SucceededAt": "2026-11-20T11:55:01.7308254Z", "PerformanceDuration": "3"}	0
601	209	Succeeded	\N	2026-11-20 12:15:03.00405+00	{"Latency": "28", "SucceededAt": "2026-11-20T12:15:02.9938581Z", "PerformanceDuration": "3"}	0
611	213	Enqueued	Triggered by recurring job scheduler	2026-11-20 12:35:04.539219+00	{"Queue": "default", "EnqueuedAt": "2026-11-20T12:35:04.5262904Z"}	0
613	213	Succeeded	\N	2026-11-20 12:35:04.604336+00	{"Latency": "108", "SucceededAt": "2026-11-20T12:35:04.5928007Z", "PerformanceDuration": "13"}	0
477	168	Succeeded	\N	2026-11-20 08:13:03.185044+00	{"Latency": "41", "SucceededAt": "2026-11-20T08:13:03.1738472Z", "PerformanceDuration": "662"}	0
\.


--
-- Data for Name: AspNetRoleClaims; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetRoleClaims" ("Id", "RoleId", "ClaimType", "ClaimValue") FROM stdin;
\.


--
-- Data for Name: AspNetRoles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetRoles" ("Id", "Name", "NormalizedName", "ConcurrencyStamp") FROM stdin;
204667e9-a93d-436c-9c39-886578ced07f	Admin	ADMIN	\N
5c0d7561-caa9-4f71-91be-02ff80af318c	Author	AUTHOR	\N
7e9fb518-d001-4f92-8cd8-677a2788a3ba	Reader	READER	\N
\.


--
-- Data for Name: AspNetUserClaims; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUserClaims" ("Id", "UserId", "ClaimType", "ClaimValue") FROM stdin;
\.


--
-- Data for Name: AspNetUserLogins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUserLogins" ("LoginProvider", "ProviderKey", "ProviderDisplayName", "UserId") FROM stdin;
\.


--
-- Data for Name: AspNetUserRoles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUserRoles" ("UserId", "RoleId") FROM stdin;
422d51e4-91ce-4825-a86f-c097e0462568	5c0d7561-caa9-4f71-91be-02ff80af318c
3167970c-6c76-4509-aae1-1436c28a22a9	5c0d7561-caa9-4f71-91be-02ff80af318c
c447940c-ef23-48c8-8cfa-43caf67f06ba	5c0d7561-caa9-4f71-91be-02ff80af318c
874af7e8-2987-4682-bc98-d11e2b4b1e4e	5c0d7561-caa9-4f71-91be-02ff80af318c
046dceb6-cb45-449e-b70c-a0897f399f11	5c0d7561-caa9-4f71-91be-02ff80af318c
78102225-6452-4b6e-aefb-9d3004b3ff01	5c0d7561-caa9-4f71-91be-02ff80af318c
54bf960d-aea6-444e-b9da-1a58d6672e0e	5c0d7561-caa9-4f71-91be-02ff80af318c
360d2dc7-0f2f-4c9f-acfd-599e92c30648	5c0d7561-caa9-4f71-91be-02ff80af318c
08ef7282-ea0f-4d83-a7e8-792f206ef200	5c0d7561-caa9-4f71-91be-02ff80af318c
4d407450-6402-49e5-a071-af6d544f1fd1	5c0d7561-caa9-4f71-91be-02ff80af318c
14514bfd-e7b8-42df-980b-c14bcb7561a5	5c0d7561-caa9-4f71-91be-02ff80af318c
70485f8d-a5b9-404a-af4e-22c437b5dc5a	5c0d7561-caa9-4f71-91be-02ff80af318c
15ade563-e497-4362-98a1-e6ebb41f0c71	5c0d7561-caa9-4f71-91be-02ff80af318c
ca98b73a-0982-4a3c-9834-a7df0fd609d3	5c0d7561-caa9-4f71-91be-02ff80af318c
a343771d-bafb-4a55-9459-2739d0b00a20	5c0d7561-caa9-4f71-91be-02ff80af318c
a343771d-bafb-4a55-9459-2739d0b00a20	204667e9-a93d-436c-9c39-886578ced07f
ca98b73a-0982-4a3c-9834-a7df0fd609d3	204667e9-a93d-436c-9c39-886578ced07f
852cc4dc-913d-4d95-8962-4c5407d77d3c	5c0d7561-caa9-4f71-91be-02ff80af318c
603ccb4d-7433-4df4-883a-e5c9aa132928	7e9fb518-d001-4f92-8cd8-677a2788a3ba
483865f1-1295-464b-95c1-f7502f5b7a16	5c0d7561-caa9-4f71-91be-02ff80af318c
cc06a093-474f-4659-9db0-ed4c708e2978	5c0d7561-caa9-4f71-91be-02ff80af318c
e95303ad-ac74-4ab2-88e7-e989ae0f17a4	5c0d7561-caa9-4f71-91be-02ff80af318c
ca9773bc-2065-432d-bde5-43001b2e1415	5c0d7561-caa9-4f71-91be-02ff80af318c
7d581264-5002-4f9d-823b-11f89ddbbb9b	5c0d7561-caa9-4f71-91be-02ff80af318c
1c7a1ddf-c7eb-4029-8fe4-49f5ea29a8b0	5c0d7561-caa9-4f71-91be-02ff80af318c
7c46cda2-3fd0-431a-894f-c0b15881fbfb	5c0d7561-caa9-4f71-91be-02ff80af318c
078bf482-fe40-4efb-9281-4ae88d007f46	5c0d7561-caa9-4f71-91be-02ff80af318c
573f12df-dbdb-40b0-82f9-bd52ca5c972c	5c0d7561-caa9-4f71-91be-02ff80af318c
456e6fad-7dc8-4695-8063-23bf6e2c73f3	5c0d7561-caa9-4f71-91be-02ff80af318c
98ec81e8-21ab-41be-a3f2-cdf05dfcc8b5	5c0d7561-caa9-4f71-91be-02ff80af318c
e301ed09-eb9c-4060-a36b-ed3b18e1ccc8	5c0d7561-caa9-4f71-91be-02ff80af318c
\.


--
-- Data for Name: AspNetUserTokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUserTokens" ("UserId", "LoginProvider", "Name", "Value") FROM stdin;
\.


--
-- Data for Name: AspNetUsers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AspNetUsers" ("Id", "DisplayName", "AvatarUrl", "Bio", "IsActive", "CreatedAt", "UserName", "NormalizedUserName", "Email", "NormalizedEmail", "EmailConfirmed", "PasswordHash", "SecurityStamp", "ConcurrencyStamp", "PhoneNumber", "PhoneNumberConfirmed", "TwoFactorEnabled", "LockoutEnd", "LockoutEnabled", "AccessFailedCount") FROM stdin;
422d51e4-91ce-4825-a86f-c097e0462568	Hoàng Phát Lê	https://ipfs.io/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/632.jpg	\N	t	2026-10-07 07:48:43.977097+00	HoDiep26	HODIEP26	DoanThanh.Ly25@hotmail.com	DOANTHANH.LY25@HOTMAIL.COM	t	AQAAAAIAAYagAAAAELawFFtM40sN5enwtfAJYwVR7m4pfWVaGDwXQxF4xyh+Y8K6LLYD800ZJLcoEyM6aw==	7HOCHAZNLVKQR35VPFRN624YUZEK5ATA	39efb368-703b-4a6a-9931-8f74c40787d7	\N	f	f	\N	t	0
3167970c-6c76-4509-aae1-1436c28a22a9	Quỳnh Sa Đặng	https://ipfs.io/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1020.jpg	\N	t	2026-10-07 07:48:43.988257+00	NgocLy81	NGOCLY81	ThaoQuyen70@yahoo.com	THAOQUYEN70@YAHOO.COM	t	AQAAAAIAAYagAAAAEMkXSpf0Vq+LPGrfgy3F35f4bb/wNybKOdFQralbySuCitf1SqvvXSkIj1WmIz3kcQ==	OQNB7AKFPCJO4UNDKVWYFQIPNOJLIUIO	aca0dab4-e786-432b-9e52-25ec460c4393	\N	f	f	\N	t	0
c447940c-ef23-48c8-8cfa-43caf67f06ba	Bảo Sơn Nguyễn	https://ipfs.io/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/4.jpg	\N	t	2026-10-07 07:48:43.988355+00	KhaiHoa_Le51	KHAIHOA_LE51	CamLy_Tang@gmail.com	CAMLY_TANG@GMAIL.COM	t	AQAAAAIAAYagAAAAEBUkx3Iz/Tv+hwdC4b/kGyarz+Nquyog5XFHRv09b+UdwL5NDk+pdbiMfdBN8BNoDQ==	7G4S4KH32NHB3SZTUJ35XXVTYYUEVKSR	7a6a32c8-6896-420a-a090-07dd99eb0f81	\N	f	f	\N	t	0
046dceb6-cb45-449e-b70c-a0897f399f11	Phi Nhạn Đoàn	https://ipfs.io/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/16.jpg	\N	t	2026-10-07 07:48:43.98839+00	KhanhHa_Nguyen	KHANHHA_NGUYEN	TrucChi.Trinh@gmail.com	TRUCCHI.TRINH@GMAIL.COM	t	AQAAAAIAAYagAAAAEFFCQyYqIa2VBjHm0suUGUw48gZ/5ZpOLrnxqGlek73jktdtdsDpipSSFf0soo7yjA==	X23YBGQHVRA4GMXDKBKQIVSEYMDZPW5U	05512eff-1d03-446a-b50b-318b88f10533	\N	f	f	\N	t	0
78102225-6452-4b6e-aefb-9d3004b3ff01	Thu Nhiên Phan	https://ipfs.io/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/11.jpg	\N	t	2026-10-07 07:48:43.988413+00	GiaKhanh46	GIAKHANH46	PhiHai.Do@gmail.com	PHIHAI.DO@GMAIL.COM	t	AQAAAAIAAYagAAAAEK3Y8j4GXc3C6N8yLr2xu0LhDNEbbG2h9TsYJIVinp/5F8xOcix6IQa+CrNVBWLvrg==	WWHEBRCRMDSRAK6OXZHIMQAK5QYQAFWU	f784a9d4-b207-4f61-b4fb-f7aec908ff49	\N	f	f	\N	t	0
54bf960d-aea6-444e-b9da-1a58d6672e0e	Quang Triệu Phạm	https://ipfs.io/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/55.jpg	\N	t	2026-10-07 07:48:43.988425+00	AnhChi.Nguyen	ANHCHI.NGUYEN	TrongDuy_Do@hotmail.com	TRONGDUY_DO@HOTMAIL.COM	t	AQAAAAIAAYagAAAAEBX3jMN2/0sr2ACQwa8N2LNOK4M4NBg/Ntnn0aUY4V/CNjbv5khAh2VFrJJ6zRMCGw==	OFHUGEOFT6F55OSWIXZI65RDCFLLJ5W3	33ce0775-7142-4af6-9dd6-b537b6933bcf	\N	f	f	\N	t	0
360d2dc7-0f2f-4c9f-acfd-599e92c30648	Thái Chi Lê	https://ipfs.io/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1197.jpg	\N	t	2026-10-07 07:48:43.988445+00	TueNhi.Lam	TUENHI.LAM	ThienTinh.Dao88@gmail.com	THIENTINH.DAO88@GMAIL.COM	t	AQAAAAIAAYagAAAAEC6o+M5sSuZk8I9xN0P6WCxmGW8/+7CHb/rWIxlxbKSxkddQBtkRfsST9o+7kOjGFQ==	Y6CJ5U4B74HFL5PY64JBZL2V7I4CY4DY	73e43394-92a5-4110-a28f-a96b17a78ba2	\N	f	f	\N	t	0
08ef7282-ea0f-4d83-a7e8-792f206ef200	Thanh Kiều Trịnh	https://ipfs.io/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/641.jpg	\N	t	2026-10-07 07:48:43.988454+00	KimThong.Tran	KIMTHONG.TRAN	KhanhVi59@hotmail.com	KHANHVI59@HOTMAIL.COM	t	AQAAAAIAAYagAAAAELv19YGD7cGlKdVGwRJx7pfY30rs6tpXoWHT2Kk0XOBajhkY0/jibkAXlLOlkF6RTw==	OKDUTLTZFIK6I5ELASAUDJCB3EBIRDWH	9139a16e-36b5-4796-93eb-3197acaaed42	\N	f	f	\N	t	0
4d407450-6402-49e5-a071-af6d544f1fd1	Vương Triều Đinh	https://ipfs.io/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/33.jpg	\N	t	2026-10-07 07:48:43.988468+00	HongLinh55	HONGLINH55	HiepHien_Pham@hotmail.com	HIEPHIEN_PHAM@HOTMAIL.COM	t	AQAAAAIAAYagAAAAEIOml2ezigndATum7vF4GCzoimKj6kyj+qcx09sUv1BPTHReAJbzw0uQDQH2C02QQQ==	57RD4MMDEXXJ2DETWFHFKPBIXVOBDJIN	c3e1b0df-65f1-45b9-94c4-dfc65859be9a	\N	f	f	\N	t	0
70485f8d-a5b9-404a-af4e-22c437b5dc5a	Tác Giả A	\N		t	2026-10-10 15:47:28.571886+00	author_a	AUTHOR_A	author_a@gmail.com	AUTHOR_A@GMAIL.COM	f	AQAAAAIAAYagAAAAEO8ZlXR2Ptf21eQvtheM2RwfUuYTraVF931AYy6W5SMiSnwkp7nfYxjpfPUjKRrtKw==	HFF3D5RX4G3RLV46CTSQKOBB2KJIR4X5	ff226f10-e237-4756-9138-196a04b8cd12	\N	f	f	\N	t	0
15ade563-e497-4362-98a1-e6ebb41f0c71	Tác Giả B	\N	\N	t	2026-10-10 15:54:42.886747+00	author_b	AUTHOR_B	author_b@gmail.com	AUTHOR_B@GMAIL.COM	f	AQAAAAIAAYagAAAAECSdGsc1caBnZmnLQh+pwfPgGHYvwNzF0MWwEhxEb4aE3hV/pP1t5jKWOPfytFcl4Q==	6E4UHWKFSN6KG2JFJOV7ZGGW3UXNLS6S	4dede0ee-5c10-428f-bf40-b8c932b7cbab	\N	f	f	\N	t	0
874af7e8-2987-4682-bc98-d11e2b4b1e4e	Bảo Hoa Lâm	https://ipfs.io/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/965.jpg	\N	t	2026-10-07 07:48:43.988377+00	MinhHung2	MINHHUNG2	NgocTuan24@gmail.com	NGOCTUAN24@GMAIL.COM	t	AQAAAAIAAYagAAAAEEfM+XZbjwAZmojOLo9dd7mzJEnazlX3VGrOtcbZr0uaXXyZKiYWY5/IpAQfJmp9SQ==	7YKASWBQWKL7MVTPHAAEXL6XSGKJALQE	2846551f-9bba-4c75-b825-b47b507df0b5	\N	f	f	\N	t	0
14514bfd-e7b8-42df-980b-c14bcb7561a5	Nguyễn Thành Minh	\N	\N	t	2026-10-07 12:14:23.277953+00	Minh	MINH	test1@gmail.com	TEST1@GMAIL.COM	f	AQAAAAIAAYagAAAAEI/ibKbIWkMUDsbZYz5wSEEousnH5I3uvY3wsOrZHK+RpMWCqPw2DzBg+XB4uLpeqQ==	XP2DVLOVOWEFK63AZHNPXLDNFQAVZ7P5	5ba01747-a95d-4a2e-8938-6479f28ab957	\N	f	f	\N	t	3
483865f1-1295-464b-95c1-f7502f5b7a16	Nguyễn Thành Minh	\N	\N	t	2026-10-28 10:20:15.152009+00	Minh15122005	MINH15122005	nguyenthanhminh151205@gmail.com	NGUYENTHANHMINH151205@GMAIL.COM	f	AQAAAAIAAYagAAAAELMTSF8UYKKo/4AHSPd4DtlTZHHR7DLavxIYp8xOh/84a2urXBfQv6ralrWbHetifg==	LU35CW6J7SNNLBC55YENGCDBWUCI3AJO	d9cfb27f-2ca2-4242-84a3-7e4bb1e5ad1a	\N	f	f	\N	t	1
ca98b73a-0982-4a3c-9834-a7df0fd609d3	Nguyễn Thành Minh	\N		t	2026-10-21 10:38:52.853506+00	Minh1512	MINH1512	2312691@dlu.edu.vn	2312691@DLU.EDU.VN	f	AQAAAAIAAYagAAAAEKRHPvep2hS6E/JIz8moywi5ZNB4tdEmWfqrimDA9a8hdVoq1yZ6F/vJIbuypgUTFw==	MIZMJ2HAKZXELAMTVA6M62FSS3JLYKL4	9df99bde-4b0a-4fb3-b51d-af39863880e4	\N	f	f	\N	t	0
a343771d-bafb-4a55-9459-2739d0b00a20	Quản trị viên Hệ thống	https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80	\N	t	2026-10-21 11:31:46.37046+00	admin	ADMIN	admin@culinaryblog.com	ADMIN@CULINARYBLOG.COM	f	AQAAAAIAAYagAAAAEEXbte+ilFE5ANHzpsOsmInC8FWl1LCr6THrlFjq/soPq/xa7lwM6rkJsdFKezIxEA==	HY4XWFBYWJVBST2OLQ7EA2LDEWIIFT4M	d7a3a3ee-6dbf-485a-babf-5c22f56a0660	\N	f	f	\N	t	0
852cc4dc-913d-4d95-8962-4c5407d77d3c	Đầu bếp Chuẩn Vị	https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80	\N	t	2026-10-27 03:44:39.738271+00	author	AUTHOR	author@culinaryblog.com	AUTHOR@CULINARYBLOG.COM	t	AQAAAAIAAYagAAAAEMnLvDQdp/TMNJfO329xE19N1TtrRLF1cwnTnimjld6cl9cDboE6kkQDpehbFlu+wA==	U4Q3WFEJNIHIUJMRMWKFZKB76XJ4GTPN	b9d3ae62-46a5-4d0f-9ff8-3ac54192de22	\N	f	f	\N	t	0
e301ed09-eb9c-4060-a36b-ed3b18e1ccc8	Nguyễn Thành Minh	\N	\N	t	2026-11-10 05:03:47.194502+00	newadmin_1794287027118	NEWADMIN_1794287027118	newadmin_1794287027118@culinaryblog.com	NEWADMIN_1794287027118@CULINARYBLOG.COM	f	AQAAAAIAAYagAAAAEEGtan38DF4Ly8ei0AYEAqID2EzBFC3Nt1Vu0/LxVDq/Bfutpkk+pYQyvF/KSmQyRg==	OZ47577A4GBYZ5CPVXIGSRM2TIDZ37RV	e60f19d1-86f2-4d09-9fda-f8cf07512c1a	\N	f	f	\N	t	0
603ccb4d-7433-4df4-883a-e5c9aa132928	Thành viên Khám Phá	https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80	\N	t	2026-10-27 03:44:39.94428+00	user	USER	user@culinaryblog.com	USER@CULINARYBLOG.COM	t	AQAAAAIAAYagAAAAEPEN0DdOGxbqDWl3WLh60+7R1pc5llqiXiEdwStsp1oFdak785hZjZ45sW9Jm10SXg==	WH3PM2HIRMJ3ZGIUUSSJPWSTWH4WOZNM	fc0b5195-e367-46d2-8c0e-6966e49daeec	\N	f	f	\N	t	0
cc06a093-474f-4659-9db0-ed4c708e2978	Bếp trưởng Nguyễn Anh	https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80	\N	t	2026-11-04 04:26:38.321442+00	nguyenanh	NGUYENANH	nguyenanh@culinaryblog.com	NGUYENANH@CULINARYBLOG.COM	t	AQAAAAIAAYagAAAAEPyja1gBLu51B+/qlVcIwgI/2MRa+ovxg8sffCuI0Ad7Jp9hB8wz/Obs3AU3KfvbZg==	34N5QZTG4JZ3NVRT2VBNVV7GECAT7GUU	c7c593e2-4ff8-4c96-a132-ecd615127c35	\N	f	f	\N	t	0
e95303ad-ac74-4ab2-88e7-e989ae0f17a4	Nghệ nhân Trần Bình	https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=400&q=80	\N	t	2026-11-04 04:26:38.550463+00	tranbinh	TRANBINH	tranbinh@culinaryblog.com	TRANBINH@CULINARYBLOG.COM	t	AQAAAAIAAYagAAAAEMpOwZgdBkfIkLusdzNWH5t+ouGMpwtqeYpLJS9wIOkluKvsRWdHIW8//mQPwIvDMQ==	5WZHLCGHFBSKHDPK2RNASXH66BX2HJGF	133de953-3956-430c-8e3f-a89494544ac2	\N	f	f	\N	t	0
ca9773bc-2065-432d-bde5-43001b2e1415	Chuyên gia Lê Chi	https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80	\N	t	2026-11-04 04:26:38.631719+00	lechi	LECHI	lechi@culinaryblog.com	LECHI@CULINARYBLOG.COM	t	AQAAAAIAAYagAAAAEGSgFio4+6h9HNy6XYXocxrv2p29jOnK0MyfnPhZ7tum6cptPOYos+pTmtxLa6900g==	E23MNWWANW24NZZL5GNQ7RYSSJLYLXX5	753d7ad0-9be4-45c0-8039-bcec44733bb4	\N	f	f	\N	t	0
7d581264-5002-4f9d-823b-11f89ddbbb9b	Bếp trưởng Phạm Dũng	https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80	\N	t	2026-11-04 04:26:38.708213+00	phamdung	PHAMDUNG	phamdung@culinaryblog.com	PHAMDUNG@CULINARYBLOG.COM	t	AQAAAAIAAYagAAAAEP22pbmDN65bIZQTJvRuGjly/Ba19PY/Aqt+G15iiePrT3UHrZ4Rm74VEfNu4QDLAA==	NLSFB2NWA5K7UYRSX5XZYGP4336UROAU	2c248fec-5be3-46aa-8354-d759dec9ef4e	\N	f	f	\N	t	0
1c7a1ddf-c7eb-4029-8fe4-49f5ea29a8b0	Đầu bếp Hoàng Yến	https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80	\N	t	2026-11-04 04:26:38.787654+00	hoangyen	HOANGYEN	hoangyen@culinaryblog.com	HOANGYEN@CULINARYBLOG.COM	t	AQAAAAIAAYagAAAAEFFTNCUz22+dJPTalhj38CJ9DX7i7DBGnlfXTT7RcfNFfHhkWlKZ53Upvvs775ZetA==	JFHOSNMG35WYHRJSGWE5FEX633TDBPB7	15b4eafc-319f-4245-a5bb-9bf5af9be21d	\N	f	f	\N	t	0
7c46cda2-3fd0-431a-894f-c0b15881fbfb	Chuyên gia Võ Hà	https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80	\N	t	2026-11-04 04:26:38.868272+00	voha	VOHA	voha@culinaryblog.com	VOHA@CULINARYBLOG.COM	t	AQAAAAIAAYagAAAAEHtC1PTlwCxYo59+4B6BCWHMmVOaTAiVxKtytyMHttziYp3UOOsfQskgJmSDQetRpA==	G5OQ3JOSFQSLTZRACZ7LS4OGVFCLA53N	9158ca5e-9917-48cf-9711-04ee47dbc3fa	\N	f	f	\N	t	0
078bf482-fe40-4efb-9281-4ae88d007f46	Đầu bếp Đặng Khoa	https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80	\N	t	2026-11-04 04:26:38.946292+00	dangkhoa	DANGKHOA	dangkhoa@culinaryblog.com	DANGKHOA@CULINARYBLOG.COM	t	AQAAAAIAAYagAAAAENiXM53QrV4hWYwzGDue3USXIWGmKxH1NqsrwqT93JKoVC2egl2L5GYxBYFNhoJtzg==	5N3IVJXJOCT3CSLUGVCB5QWYXYUINPO2	9423edec-4cdf-4d74-8b94-ee7eac195b1b	\N	f	f	\N	t	0
573f12df-dbdb-40b0-82f9-bd52ca5c972c	Nghệ nhân Bùi Mai	https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80	\N	t	2026-11-04 04:26:39.032014+00	buimai	BUIMAI	buimai@culinaryblog.com	BUIMAI@CULINARYBLOG.COM	t	AQAAAAIAAYagAAAAEMpyYSOUVAMpFRAuO2HjOT2Tq1wdCH+PgPq4eNoH0eaD5h5mUj96dyVJ3Vyn6bBXIA==	JMHEPADYUVKL5NTKTXT7CZ4FXV42FTCL	48f57f9b-8e24-44db-911a-f9e0b1957d36	\N	f	f	\N	t	0
456e6fad-7dc8-4695-8063-23bf6e2c73f3	Bếp trưởng Đỗ Nam	https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80	\N	t	2026-11-04 04:26:39.110537+00	donam	DONAM	donam@culinaryblog.com	DONAM@CULINARYBLOG.COM	t	AQAAAAIAAYagAAAAEAANIs1+kKbdb+MJ5gc12fuHtpjmNF8kWaRoWsKfjYnV0LaHT3bQmN/gjVPZjqMQgA==	EFEU3AC2LBCBB2HTGISNXDDYTVY3ZOF7	24aa515a-f3f7-4c19-aadf-070b9b10cfad	\N	f	f	\N	t	0
98ec81e8-21ab-41be-a3f2-cdf05dfcc8b5	Chuyên gia Ngô Phương	https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80	\N	t	2026-11-04 04:26:39.188568+00	ngophuong	NGOPHUONG	ngophuong@culinaryblog.com	NGOPHUONG@CULINARYBLOG.COM	t	AQAAAAIAAYagAAAAEPPDkVkOR/lKmJ5/AqcF/8gbPnfVBwjxRbncwjZieVztLW+ITf7KYlEANOTx0zHTWQ==	ZXRIIGUWUVIINQYK3MJSNRPWFISUCBXY	9e5e4052-d92e-49ab-9402-9530d2ca2d59	\N	f	f	\N	t	0
\.


--
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Categories" ("Id", "Name", "Slug", "Description", "ImageUrl", "OrderIndex", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion") FROM stdin;
b138f0a7-08c2-4041-a281-0a7eb2e63094	Món Khai Vị	mon-khai-vi	Các món gỏi, chả giò, nem rán nhẹ nhàng kích thích vị giác trước bữa ăn.	/culinary-blog/categories/mon-khai-vi.jpg	1	2026-10-07 07:48:45.255684+00	2026-11-20 09:11:10.119014+00	f	\\x0046d416ce275b4b8b824e9dced26a86
33cbe291-2ee0-4fef-bbd9-310770c0ef54	Món Chính	mon-chinh	Các món ăn chính đậm đà, giàu dinh dưỡng cho bữa cơm gia đình.	/culinary-blog/categories/mon-chinh.jpg	2	2026-10-07 07:48:45.255684+00	2026-11-20 09:11:10.119014+00	f	\\x7adf9844dcc5ec4b825d5c6aaaf2fa34
5d3acf4a-1672-4654-8d90-9118a6ee06ba	Canh - Súp	canh-sup	Các món canh chua, canh thanh mát và súp bổ dưỡng cho mọi lứa tuổi.	/culinary-blog/categories/canh-sup.jpg	3	2026-10-07 07:48:45.255684+00	2026-11-20 09:11:10.119014+00	f	\\xb9e328180ccfe14fa550fe64b8e162aa
466433f7-31a6-49af-8ff5-4b68eb3683eb	Món Xào	mon-xao	Các món xào giòn ngọt từ rau củ, hải sản và thịt bò tươi ngon.	/culinary-blog/categories/mon-xao.jpg	5	2026-10-07 07:48:45.255684+00	2026-11-20 09:11:10.119014+00	f	\\xff13e6011ecafe4ca02274f1f50db40b
48914c7a-b280-45d4-b0b3-7ac5488f9394	Món Nướng	mon-nuong	Các món nướng than hoa, nồi chiên không dầu thơm lừng hấp dẫn.	/culinary-blog/categories/mon-nuong.jpg	6	2026-10-07 07:48:45.255684+00	2026-11-20 09:11:10.119014+00	f	\\xb35c42e54a41924f8ecfde34bb674996
72414fc7-6908-4dfe-a469-e692d8ea2c42	Món Chay	mon-chay	Món ăn thuần chay thanh tịnh, dinh dưỡng từ nấm, đậu hũ và rau củ tươi.	/culinary-blog/categories/mon-chay.jpg	12	2026-10-07 07:48:45.255684+00	2026-11-20 09:11:10.119014+00	f	\\x90df1886a8368d4ca56ab1bcfb9f48fc
01e55497-eb5a-4c0e-b01a-93b32aa00a9d	Tráng Miệng & Bánh	trang-mieng	Các món chè ngọt thanh, bánh truyền thống bùi béo tráng miệng hoàn hảo.	/culinary-blog/categories/trang-mieng.jpg	13	2026-10-07 07:48:45.255684+00	2026-11-20 09:11:10.119014+00	f	\\x91f4b81f5a6cd146942db51a44b83072
49ccbba7-0b44-4376-899a-c0689813056a	Đồ Uống & Giải Khát	do-uong	Cà phê, trà trái cây và sinh tố giải nhiệt thanh mát cho cả nhà.	/culinary-blog/categories/do-uong.jpg	14	2026-10-07 07:48:45.255684+00	2026-11-20 09:11:10.119014+00	f	\\x8a64b52a496b65429f8383f01963d491
c73c5844-5458-4613-ae07-7f00e368457f	Món Kho	mon-kho	Các món thịt kho, cá kho tộ đậm đà thơm nức mùi nước màu và tiêu ớt.	/culinary-blog/categories/mon-kho.jpg	4	2026-10-07 07:48:45.255684+00	2026-11-20 09:11:10.119014+00	f	\\xa2a836f9d0e76046a6cfce70578f3639
df8ce4d2-203d-489f-89b8-91629c4f610e	Bún - Phở - Mì	bun-pho-mi	Tinh hoa món nước Việt Nam từ phở bò, bún chả, bún bò đến hủ tiếu đậm đà.	/culinary-blog/categories/bun-pho-mi.jpg	9	2026-10-07 07:48:45.255684+00	2026-11-20 09:11:10.119014+00	f	\\xa6f9d1f67110ff4f987157a9ec7f959d
db628456-1e16-4c67-bd2a-6d297d718ef9	Món Lẩu	mon-lau	Các nồi lẩu nghi ngút khói chua cay mặn ngọt cho các buổi sum họp.	/culinary-blog/categories/mon-lau.jpg	11	2026-10-07 07:48:45.255684+00	2026-11-20 09:11:10.119014+00	f	\\xb000a3fef4511742a61c2ad2bc28e205
815bcb63-28bd-560e-8b95-d4331c543ad4	Món Chiên Rán	mon-chien	Các món chiên vàng giòn rụm, giòn rụm bên ngoài và mềm mọng bên trong.	/culinary-blog/categories/mon-chien.jpg	7	2026-11-20 08:50:54.331035+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
91b2e421-ca53-5b47-90df-1569446ba13d	Món Hấp & Luộc	mon-hap-luoc	Các món hấp cách thủy giữ trọn độ ngọt tự nhiên thanh đạm.	/culinary-blog/categories/mon-hap-luoc.jpg	8	2026-11-20 08:50:54.331035+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6a4c6042-201b-5659-b112-66e1d54def79	Món Cuốn & Nộm	mon-cuon-goi	Món cuốn bánh tráng, nộm chua ngọt kèm rau sống tươi mát thanh nhiệt.	/culinary-blog/categories/mon-cuon-goi.jpg	10	2026-11-20 08:50:54.331035+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
\.


--
-- Data for Name: NewsletterSubscribers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NewsletterSubscribers" ("Id", "Email", "NormalizedEmail", "CustomerName", "FavoriteCategorySlug", "Source", "IsActive", "UnsubscribeToken", "SubscribedAt", "UnsubscribedAt", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion") FROM stdin;
7d1d65f9-fc9b-4a21-980f-fdb6ee368a75	testsubscriber@example.com	TESTSUBSCRIBER@EXAMPLE.COM	\N	\N	HomeBanner	t	b25bd8461287ebf53375eb7cb648b44a7b6abfc39da50caa	2026-11-20 10:50:14.038191+00	\N	2026-11-20 10:50:14.053307+00	2026-11-20 11:40:59.695528+00	f	\\x4491625881916c48bc46dc6648d41943
\.


--
-- Data for Name: RecipeBookmarks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RecipeBookmarks" ("Id", "UserId", "RecipeId", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion") FROM stdin;
b5760548-27e2-4795-91bc-32f44896df6e	852cc4dc-913d-4d95-8962-4c5407d77d3c	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b4e9e486-0529-4f75-a906-5096a807bce2	ca9773bc-2065-432d-bde5-43001b2e1415	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
20294aa1-1bd1-4afd-bac7-d2726eb36cb5	7c46cda2-3fd0-431a-894f-c0b15881fbfb	15585d4c-c42e-557c-8e7b-d8634962b224	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4ab3d753-9395-4518-95a8-f3c5f1af8b51	456e6fad-7dc8-4695-8063-23bf6e2c73f3	6faa4818-6400-5edd-9816-77b5450e8ed6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
894de86c-bbbb-4e6f-b036-383df2e103ed	852cc4dc-913d-4d95-8962-4c5407d77d3c	afbf12f7-653a-5f1e-9a88-181afe8c6d76	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f11d2735-6448-4511-80fc-5fba5218a331	ca9773bc-2065-432d-bde5-43001b2e1415	c35b1123-1f4e-54ca-8d53-7bd26828403b	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
098dfd80-578d-4679-8dc5-2545b59d3dd9	7c46cda2-3fd0-431a-894f-c0b15881fbfb	65176e6d-dd1e-5109-87e3-044085e7a102	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
867cbebf-6aa3-4cc2-a569-1a4c8ce65d05	456e6fad-7dc8-4695-8063-23bf6e2c73f3	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
14c73642-1c09-4817-96b6-29d1eed7bd5c	852cc4dc-913d-4d95-8962-4c5407d77d3c	a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
74d4e08c-9d46-424c-89f9-37aaae56133c	ca9773bc-2065-432d-bde5-43001b2e1415	28b8f38a-632d-572c-b260-34207bfdd35f	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cac083cc-dccc-4be7-95d6-efc7a592696d	7c46cda2-3fd0-431a-894f-c0b15881fbfb	874dd168-04dc-5ff5-8b0c-46fe08b54760	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8b7ef849-8c5c-4681-94ec-c2b191f0b341	456e6fad-7dc8-4695-8063-23bf6e2c73f3	7a541a1d-207a-515c-93c3-2424f0c1d745	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d95a47cf-a21f-4731-8e83-5af7d6a621d1	852cc4dc-913d-4d95-8962-4c5407d77d3c	4e38d2f2-95fe-54b4-be87-08b700da58cb	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0b4f5ef2-9e93-4d24-b0c5-a705ae28b9dd	ca9773bc-2065-432d-bde5-43001b2e1415	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
24760644-e06f-48f1-8adb-36e486d68f56	7c46cda2-3fd0-431a-894f-c0b15881fbfb	18c4049d-bbdd-5c84-8bb4-8574700a9491	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
73a9d602-db28-4041-bf60-2bf34ce3b947	456e6fad-7dc8-4695-8063-23bf6e2c73f3	dacd5de8-f548-5e96-9b09-bee5320ee3e8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e1785964-6693-4c4a-9822-ebd92716dd99	852cc4dc-913d-4d95-8962-4c5407d77d3c	dd6da83f-f56b-5b05-9907-30a6eccf87da	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ab47f468-e4ad-4252-b58f-5a4f5bf09eb4	ca9773bc-2065-432d-bde5-43001b2e1415	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c987a535-b75b-4b9e-b75b-6a9bb9779383	7c46cda2-3fd0-431a-894f-c0b15881fbfb	4f40fcf1-a515-522d-848b-1535f445e73d	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2c8f7db2-bd62-4a84-b141-b59b1e9d2c2b	852cc4dc-913d-4d95-8962-4c5407d77d3c	9cf5ba46-1b6e-4925-991c-8f2ed99ecf47	2026-11-20 10:40:31.723872+00	\N	f	\\xf6e94d5dcad15a46a55550c5597d29e6
db2b3fa5-c2e8-4cc8-bbdc-236797d61914	852cc4dc-913d-4d95-8962-4c5407d77d3c	94316a16-622a-47c9-a58d-dcb00ad86454	2026-11-20 10:48:57.035183+00	\N	f	\\x4661eb3f1effd141927e00851f41bbc9
bc6ae6f0-5c7a-4f3b-8c3e-51e701780492	603ccb4d-7433-4df4-883a-e5c9aa132928	8fb6b8bb-aad6-4a1e-8dbc-cc9ea67452e6	2026-11-20 11:39:26.025221+00	\N	f	\\x5ab12681aceb1645978c3438a984454c
\.


--
-- Data for Name: RecipeImages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RecipeImages" ("Id", "RecipeId", "OriginalUrl", "MediumUrl", "ThumbnailUrl", "AltText", "IsPrimary", "OrderIndex", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion") FROM stdin;
37c9da41-c657-5bdf-b54d-50de2d9e69ac	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	/culinary-blog/recipes/d7fe03bf-8d56-5f1c-b9e4-e0d70760050c/cover.jpg	/culinary-blog/recipes/d7fe03bf-8d56-5f1c-b9e4-e0d70760050c/cover.jpg	/culinary-blog/recipes/d7fe03bf-8d56-5f1c-b9e4-e0d70760050c/cover.jpg	Món Chả giò miền Nam nhân tôm thịt ngon giòn tan để đãi tiệc gia đình thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
120084e4-b416-5a26-ae9b-c6cc99f5a466	b22a7344-85f2-5dff-abee-0dfcb97903d8	/culinary-blog/recipes/b22a7344-85f2-5dff-abee-0dfcb97903d8/cover.jpg	/culinary-blog/recipes/b22a7344-85f2-5dff-abee-0dfcb97903d8/cover.jpg	/culinary-blog/recipes/b22a7344-85f2-5dff-abee-0dfcb97903d8/cover.jpg	Món 3 món từ măng cụt: Gỏi gà măng cụt, sinh tố măng cụt, chè măng cụt thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
228dd8c2-8384-5237-81a3-960d92fd27f0	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	/culinary-blog/recipes/2a7249a8-81a4-56c0-aaba-3b2d96272ef1/cover.jpg	/culinary-blog/recipes/2a7249a8-81a4-56c0-aaba-3b2d96272ef1/cover.jpg	/culinary-blog/recipes/2a7249a8-81a4-56c0-aaba-3b2d96272ef1/cover.jpg	Món Gỏi bò rau má thơm ngon thanh mát giải nhiệt cho cả gia đình thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e6223985-e8b0-51ba-bfeb-86cb1a0ffe28	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	/culinary-blog/recipes/d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a/cover.jpg	/culinary-blog/recipes/d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a/cover.jpg	/culinary-blog/recipes/d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a/cover.jpg	Món Nem rán chay - chả giò chay giòn tan ngon khó cưỡng thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
afe338a3-79e0-59a5-8948-54b46741e73e	445ef256-51b0-58aa-ba79-298d864b5f2e	/culinary-blog/recipes/445ef256-51b0-58aa-ba79-298d864b5f2e/cover.jpg	/culinary-blog/recipes/445ef256-51b0-58aa-ba79-298d864b5f2e/cover.jpg	/culinary-blog/recipes/445ef256-51b0-58aa-ba79-298d864b5f2e/cover.jpg	Món Thịt kho trám xanh thơm ngon bùi béo cực hao cơm cho cả gia đình thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
682b5984-8a83-528e-a09b-df6d674a3e72	919afa90-0ae2-544c-aa7a-fab802ea448f	/culinary-blog/recipes/919afa90-0ae2-544c-aa7a-fab802ea448f/cover.jpg	/culinary-blog/recipes/919afa90-0ae2-544c-aa7a-fab802ea448f/cover.jpg	/culinary-blog/recipes/919afa90-0ae2-544c-aa7a-fab802ea448f/cover.jpg	Món Miến trộn thập cẩm dai ngon chuẩn vị cực hấp dẫn, đơn giản tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e0427301-d774-5889-943f-ca09ca4183d2	15585d4c-c42e-557c-8e7b-d8634962b224	/culinary-blog/recipes/15585d4c-c42e-557c-8e7b-d8634962b224/cover.jpg	/culinary-blog/recipes/15585d4c-c42e-557c-8e7b-d8634962b224/cover.jpg	/culinary-blog/recipes/15585d4c-c42e-557c-8e7b-d8634962b224/cover.jpg	Món Bê hấp tía tô thơm ngon, thịt mềm ngọt không bị hôi cực đơn giản thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d80426b9-7384-5479-a1d2-0377b95c1633	b7389d5f-1c77-593c-b5c6-bc16e531af2d	/culinary-blog/recipes/b7389d5f-1c77-593c-b5c6-bc16e531af2d/cover.jpg	/culinary-blog/recipes/b7389d5f-1c77-593c-b5c6-bc16e531af2d/cover.jpg	/culinary-blog/recipes/b7389d5f-1c77-593c-b5c6-bc16e531af2d/cover.jpg	Món Bún bò trộn thơm ngon, đậm đà đơn giản tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
351378de-ec5e-5963-9a96-42ee27388a0f	bdc54bd9-2643-5f8c-ba0e-84d55edb94fc	/culinary-blog/recipes/bdc54bd9-2643-5f8c-ba0e-84d55edb94fc/cover.jpg	/culinary-blog/recipes/bdc54bd9-2643-5f8c-ba0e-84d55edb94fc/cover.jpg	/culinary-blog/recipes/bdc54bd9-2643-5f8c-ba0e-84d55edb94fc/cover.jpg	Món Canh chua cá ngừ thơm ngon không tanh, chuẩn vị miền Trung tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4ac87e7b-f46c-5048-8e90-3806ba21ad91	6faa4818-6400-5edd-9816-77b5450e8ed6	/culinary-blog/recipes/6faa4818-6400-5edd-9816-77b5450e8ed6/cover.jpg	/culinary-blog/recipes/6faa4818-6400-5edd-9816-77b5450e8ed6/cover.jpg	/culinary-blog/recipes/6faa4818-6400-5edd-9816-77b5450e8ed6/cover.jpg	Món Phật nhảy tường đại bổ chuẩn vị nhà hàng cực dễ cho cả gia đình thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2fafd70c-8415-5e5e-9477-4349978bda62	e3438f8e-7aca-5d17-b956-236640ed480e	/culinary-blog/recipes/e3438f8e-7aca-5d17-b956-236640ed480e/cover.jpg	/culinary-blog/recipes/e3438f8e-7aca-5d17-b956-236640ed480e/cover.jpg	/culinary-blog/recipes/e3438f8e-7aca-5d17-b956-236640ed480e/cover.jpg	Món Món bồng khoai nấu ốc om cơm mẻ chuẩn vị miền Bắc cực đơn giản thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
617eb152-6a35-51bf-9e31-e8aaeb67257d	2070da0c-204a-5f14-acfd-36c149358124	/culinary-blog/recipes/2070da0c-204a-5f14-acfd-36c149358124/cover.jpg	/culinary-blog/recipes/2070da0c-204a-5f14-acfd-36c149358124/cover.jpg	/culinary-blog/recipes/2070da0c-204a-5f14-acfd-36c149358124/cover.jpg	Món Canh măng mực Bát Tràng với bí quyết nấu thơm ngon, chuẩn vị xưa thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
987f9213-47ee-59d9-b1e4-f2999ecae63e	afbf12f7-653a-5f1e-9a88-181afe8c6d76	/culinary-blog/recipes/afbf12f7-653a-5f1e-9a88-181afe8c6d76/cover.jpg	/culinary-blog/recipes/afbf12f7-653a-5f1e-9a88-181afe8c6d76/cover.jpg	/culinary-blog/recipes/afbf12f7-653a-5f1e-9a88-181afe8c6d76/cover.jpg	Món Thịt băm kho trứng cút đậm đà, cực hao cơm cho sinh viên tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f553cd87-2280-52b6-86ea-216e30f76c20	96927fef-8c57-5362-8093-f3f0e230d69a	/culinary-blog/recipes/96927fef-8c57-5362-8093-f3f0e230d69a/cover.jpg	/culinary-blog/recipes/96927fef-8c57-5362-8093-f3f0e230d69a/cover.jpg	/culinary-blog/recipes/96927fef-8c57-5362-8093-f3f0e230d69a/cover.jpg	Món Cá trắm kho khế chua đậm đà thơm ngon đưa cơm cho cả gia đình thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e09de7df-223f-5e84-94fe-7dc1d3559a30	a6f8bcda-1250-5c08-bcbe-08addf0bf64d	/culinary-blog/recipes/a6f8bcda-1250-5c08-bcbe-08addf0bf64d/cover.jpg	/culinary-blog/recipes/a6f8bcda-1250-5c08-bcbe-08addf0bf64d/cover.jpg	/culinary-blog/recipes/a6f8bcda-1250-5c08-bcbe-08addf0bf64d/cover.jpg	Món Cá kho dưa chua miền Bắc chuẩn vị dân dã cực đưa cơm cho cả nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
86ad3b67-a93f-5203-b916-3639b54134ad	c35b1123-1f4e-54ca-8d53-7bd26828403b	/culinary-blog/recipes/c35b1123-1f4e-54ca-8d53-7bd26828403b/cover.jpg	/culinary-blog/recipes/c35b1123-1f4e-54ca-8d53-7bd26828403b/cover.jpg	/culinary-blog/recipes/c35b1123-1f4e-54ca-8d53-7bd26828403b/cover.jpg	Món Thịt xá xíu bằng gói gia vị Cholimex mềm ngon, chuẩn vị tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
88d8b1d7-1947-5d9c-9b91-420c737fa1b2	800e1933-2782-56a9-8745-01038b6a17a6	/culinary-blog/recipes/800e1933-2782-56a9-8745-01038b6a17a6/cover.jpg	/culinary-blog/recipes/800e1933-2782-56a9-8745-01038b6a17a6/cover.jpg	/culinary-blog/recipes/800e1933-2782-56a9-8745-01038b6a17a6/cover.jpg	Món Đậu bắp xào thịt bò mềm mọng và bí quyết xào đậu bắp xanh giòn thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8a4ea1c1-7b28-521d-a426-b1cc7d24b1be	00e473bf-c28d-57bc-87b0-daeec99df819	/culinary-blog/recipes/00e473bf-c28d-57bc-87b0-daeec99df819/cover.jpg	/culinary-blog/recipes/00e473bf-c28d-57bc-87b0-daeec99df819/cover.jpg	/culinary-blog/recipes/00e473bf-c28d-57bc-87b0-daeec99df819/cover.jpg	Món Chim câu xúc bánh đa giòn thơm không tanh, đậm đà chuẩn vị tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
19d68547-81bb-5e3f-a1c9-35a01755403a	65176e6d-dd1e-5109-87e3-044085e7a102	/culinary-blog/recipes/65176e6d-dd1e-5109-87e3-044085e7a102/cover.jpg	/culinary-blog/recipes/65176e6d-dd1e-5109-87e3-044085e7a102/cover.jpg	/culinary-blog/recipes/65176e6d-dd1e-5109-87e3-044085e7a102/cover.jpg	Món Bò lúc lắc nướng sa tế bằng nồi chiên không dầu tiện lợi, hấp dẫn thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2c34cb5a-81aa-549a-8042-c226aad76f35	af6c8fb3-5c98-555c-88cd-531a8c513312	/culinary-blog/recipes/af6c8fb3-5c98-555c-88cd-531a8c513312/cover.jpg	/culinary-blog/recipes/af6c8fb3-5c98-555c-88cd-531a8c513312/cover.jpg	/culinary-blog/recipes/af6c8fb3-5c98-555c-88cd-531a8c513312/cover.jpg	Món Heo rừng xào sa tế sả ớt giòn ngon làm mồi nhấm cực đơn giản thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a9e83393-0810-5db8-be8b-b5c212992fee	0d671484-83b8-53a4-9d47-f04c612bea06	/culinary-blog/recipes/0d671484-83b8-53a4-9d47-f04c612bea06/cover.jpg	/culinary-blog/recipes/0d671484-83b8-53a4-9d47-f04c612bea06/cover.jpg	/culinary-blog/recipes/0d671484-83b8-53a4-9d47-f04c612bea06/cover.jpg	Món Cánh gà nướng muối ớt ngon đậm đà hấp dẫn dễ làm thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
33727f1d-7008-5633-b097-0ffe70acb5d1	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	/culinary-blog/recipes/fe9e5b13-de22-5cc0-b1e0-be1faf53d158/cover.jpg	/culinary-blog/recipes/fe9e5b13-de22-5cc0-b1e0-be1faf53d158/cover.jpg	/culinary-blog/recipes/fe9e5b13-de22-5cc0-b1e0-be1faf53d158/cover.jpg	Món 2 cách làm nọng heo nướng tại nhà bằng nồi chiên không dầu thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7d2e755f-dacf-5eab-ac1e-52367f2f572d	fca4c223-74d8-5132-af27-fbb11c02ebe9	/culinary-blog/recipes/fca4c223-74d8-5132-af27-fbb11c02ebe9/cover.jpg	/culinary-blog/recipes/fca4c223-74d8-5132-af27-fbb11c02ebe9/cover.jpg	/culinary-blog/recipes/fca4c223-74d8-5132-af27-fbb11c02ebe9/cover.jpg	Món Trứng cút nướng muối Trung Hoa thơm thảo mộc mà không bị mặn thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
80629de0-d506-5ba6-ab87-d91878331d7e	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	/culinary-blog/recipes/5cd6107b-08cb-5205-b4a5-e5b055f39e2f/cover.jpg	/culinary-blog/recipes/5cd6107b-08cb-5205-b4a5-e5b055f39e2f/cover.jpg	/culinary-blog/recipes/5cd6107b-08cb-5205-b4a5-e5b055f39e2f/cover.jpg	Món Vịt quay tiêu tại nhà: bí quyết chuẩn vị Ma Cao thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6e30e38b-7338-50aa-a107-24edd0500330	a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	/culinary-blog/recipes/a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48/cover.jpg	/culinary-blog/recipes/a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48/cover.jpg	/culinary-blog/recipes/a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48/cover.jpg	Món Chả tôm thịt chiên vàng giòn rụm cực ngon hấp dẫn ngay tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c9950b72-2bfc-5811-a5b2-9d14e668e9aa	0328808d-a3ff-572c-9a61-fc373949e163	/culinary-blog/recipes/0328808d-a3ff-572c-9a61-fc373949e163/cover.jpg	/culinary-blog/recipes/0328808d-a3ff-572c-9a61-fc373949e163/cover.jpg	/culinary-blog/recipes/0328808d-a3ff-572c-9a61-fc373949e163/cover.jpg	Món Thịt ba chỉ rang mắm tép đậm đà cực hao cơm cho bữa cơm gia đình thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e98ee365-782c-54f5-9ad4-302ae8e24281	5d86a6bc-b484-57ad-ade8-562a33b59cfc	/culinary-blog/recipes/5d86a6bc-b484-57ad-ade8-562a33b59cfc/cover.jpg	/culinary-blog/recipes/5d86a6bc-b484-57ad-ade8-562a33b59cfc/cover.jpg	/culinary-blog/recipes/5d86a6bc-b484-57ad-ade8-562a33b59cfc/cover.jpg	Món Cá thu sốt cam thơm ngon đậm đà cho bữa cơm gia đình thêm hấp dẫn thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
619e73cc-7407-53f7-9911-157af18711a1	28b8f38a-632d-572c-b260-34207bfdd35f	/culinary-blog/recipes/28b8f38a-632d-572c-b260-34207bfdd35f/cover.jpg	/culinary-blog/recipes/28b8f38a-632d-572c-b260-34207bfdd35f/cover.jpg	/culinary-blog/recipes/28b8f38a-632d-572c-b260-34207bfdd35f/cover.jpg	Món Xôi cua ngon và mẹo chiên vỏ xôi giòn rụm chuẩn vị như ngoài hàng thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5a375123-3eff-59b4-9638-28776a2ab9c2	f7c4667e-40e8-5e83-97c3-1beb5319a200	/culinary-blog/recipes/f7c4667e-40e8-5e83-97c3-1beb5319a200/cover.jpg	/culinary-blog/recipes/f7c4667e-40e8-5e83-97c3-1beb5319a200/cover.jpg	/culinary-blog/recipes/f7c4667e-40e8-5e83-97c3-1beb5319a200/cover.jpg	Món Gà hấp bầu ngọt ngon chuẩn vị, thơm nức mũi cực kỳ đơn giản thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9bf0b313-95fe-5744-a1a4-2550657afec3	bfd455b1-f053-5cff-8c63-b67f40072494	/culinary-blog/recipes/bfd455b1-f053-5cff-8c63-b67f40072494/cover.jpg	/culinary-blog/recipes/bfd455b1-f053-5cff-8c63-b67f40072494/cover.jpg	/culinary-blog/recipes/bfd455b1-f053-5cff-8c63-b67f40072494/cover.jpg	Món Mực hấp gừng giòn ngọt thơm nức và cực đẹp mắt để chiêu đãi cả nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
00c580b7-5ab5-5e5d-b424-a656372a1d07	874dd168-04dc-5ff5-8b0c-46fe08b54760	/culinary-blog/recipes/874dd168-04dc-5ff5-8b0c-46fe08b54760/cover.jpg	/culinary-blog/recipes/874dd168-04dc-5ff5-8b0c-46fe08b54760/cover.jpg	/culinary-blog/recipes/874dd168-04dc-5ff5-8b0c-46fe08b54760/cover.jpg	Món Gà ủ muối thảo mộc hoa tiêu chuẩn kinh doanh thơm ngon đậm vị thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bb9d12ed-58a4-54ea-9b91-f47e497130ac	2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6	/culinary-blog/recipes/2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6/cover.jpg	/culinary-blog/recipes/2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6/cover.jpg	/culinary-blog/recipes/2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6/cover.jpg	Món Xôi Hoàng Phố dẻo thơm màu vàng đẹp mắt cực đơn giản tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
10a772db-9322-5f2f-a1db-b398fc3c75d8	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	/culinary-blog/recipes/0a801e01-03a1-547c-8ab7-1cfb4dce7e19/cover.jpg	/culinary-blog/recipes/0a801e01-03a1-547c-8ab7-1cfb4dce7e19/cover.jpg	/culinary-blog/recipes/0a801e01-03a1-547c-8ab7-1cfb4dce7e19/cover.jpg	Món Phở bò trộn chua ngọt ngon miệng hấp dẫn chuẩn vị tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a5475f30-cd96-5b4d-a0e2-25700ea62a32	7a541a1d-207a-515c-93c3-2424f0c1d745	/culinary-blog/recipes/7a541a1d-207a-515c-93c3-2424f0c1d745/cover.jpg	/culinary-blog/recipes/7a541a1d-207a-515c-93c3-2424f0c1d745/cover.jpg	/culinary-blog/recipes/7a541a1d-207a-515c-93c3-2424f0c1d745/cover.jpg	Món Bún chả chan thơm ngon đậm đà tại nhà chuẩn vị như ngoài hàng thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5e82c236-40df-5d28-b8b4-18c4822e147b	a42c812f-4e4a-5ce4-b574-d95c084350f8	/culinary-blog/recipes/a42c812f-4e4a-5ce4-b574-d95c084350f8/cover.jpg	/culinary-blog/recipes/a42c812f-4e4a-5ce4-b574-d95c084350f8/cover.jpg	/culinary-blog/recipes/a42c812f-4e4a-5ce4-b574-d95c084350f8/cover.jpg	Món Hủ tiếu hấp An Giang, đặc sản miền Tây chuẩn vị đơn giản tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0cc25dcd-2c38-5ca4-b493-bad66b4ef52e	13627a6f-e0c2-5c41-88b5-6bc66344b541	/culinary-blog/recipes/13627a6f-e0c2-5c41-88b5-6bc66344b541/cover.jpg	/culinary-blog/recipes/13627a6f-e0c2-5c41-88b5-6bc66344b541/cover.jpg	/culinary-blog/recipes/13627a6f-e0c2-5c41-88b5-6bc66344b541/cover.jpg	Món Hủ tiếu pate Bến Tre thơm ngon chuẩn vị như ngoài hàng cho cả nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
edbfd44c-6a94-55a9-8867-789dafb1b2ae	4e38d2f2-95fe-54b4-be87-08b700da58cb	/culinary-blog/recipes/4e38d2f2-95fe-54b4-be87-08b700da58cb/cover.jpg	/culinary-blog/recipes/4e38d2f2-95fe-54b4-be87-08b700da58cb/cover.jpg	/culinary-blog/recipes/4e38d2f2-95fe-54b4-be87-08b700da58cb/cover.jpg	Món Bánh tráng heo quay bằng nồi chiên không dầu giòn rụm tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0425af97-c45d-58e5-8ecb-571b976e4fac	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	/culinary-blog/recipes/af002a60-e2a8-5f3a-b595-ad6bb4dfba0d/cover.jpg	/culinary-blog/recipes/af002a60-e2a8-5f3a-b595-ad6bb4dfba0d/cover.jpg	/culinary-blog/recipes/af002a60-e2a8-5f3a-b595-ad6bb4dfba0d/cover.jpg	Món Cơm âm phủ chuẩn vị Huế đơn giản ngay tại nhà! thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f06bae3d-5603-55d8-ac38-5729491ebd09	fcb19486-2256-5ad6-a6a9-729b29adcbae	/culinary-blog/recipes/fcb19486-2256-5ad6-a6a9-729b29adcbae/cover.jpg	/culinary-blog/recipes/fcb19486-2256-5ad6-a6a9-729b29adcbae/cover.jpg	/culinary-blog/recipes/fcb19486-2256-5ad6-a6a9-729b29adcbae/cover.jpg	Món Bánh cuốn Quảng Đông mềm mượt, thơm ngon chuẩn vị đơn giản tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d614b604-e1e5-58c4-895e-a03e76459760	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/cover.jpg	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/cover.jpg	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/cover.jpg	Món 2 cách làm bánh xèo miền Bắc thơm ngon giòn rụm chuẩn vị dễ làm tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0d68f691-bb73-5f7a-870b-0f5db3130f6e	9622b506-a920-5848-a276-56f99355fc69	/culinary-blog/recipes/9622b506-a920-5848-a276-56f99355fc69/cover.jpg	/culinary-blog/recipes/9622b506-a920-5848-a276-56f99355fc69/cover.jpg	/culinary-blog/recipes/9622b506-a920-5848-a276-56f99355fc69/cover.jpg	Món Bắp bò nhúng mẻ chua thanh thơm ngon hấp dẫn cực đơn giản tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4877303d-f8bf-5b16-bc38-2791e31b9c21	1ee41201-7d04-589a-9705-08cef1ff4ce3	/culinary-blog/recipes/1ee41201-7d04-589a-9705-08cef1ff4ce3/cover.jpg	/culinary-blog/recipes/1ee41201-7d04-589a-9705-08cef1ff4ce3/cover.jpg	/culinary-blog/recipes/1ee41201-7d04-589a-9705-08cef1ff4ce3/cover.jpg	Món Lẩu bò nhúng giấm (dấm) nóng hổi thơm ngon cực đơn giản tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a322414b-cdc9-5346-ae51-9a4819dc2a69	18c4049d-bbdd-5c84-8bb4-8574700a9491	/culinary-blog/recipes/18c4049d-bbdd-5c84-8bb4-8574700a9491/cover.jpg	/culinary-blog/recipes/18c4049d-bbdd-5c84-8bb4-8574700a9491/cover.jpg	/culinary-blog/recipes/18c4049d-bbdd-5c84-8bb4-8574700a9491/cover.jpg	Món Lẩu cá quả rau cải xanh thơm ngon khó cưỡng, cực đơn giản tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5cc82147-3402-5a86-8516-0a0b39cc275d	1901526a-0fcb-5c30-905d-78addcd96622	/culinary-blog/recipes/1901526a-0fcb-5c30-905d-78addcd96622/cover.jpg	/culinary-blog/recipes/1901526a-0fcb-5c30-905d-78addcd96622/cover.jpg	/culinary-blog/recipes/1901526a-0fcb-5c30-905d-78addcd96622/cover.jpg	Món Lẩu riêu cua bắp bò sườn sụn tại nhà đơn giản thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
de35c3bd-0044-5323-8b6a-804d2ff26fb0	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	/culinary-blog/recipes/e1721eed-2286-5a6b-9dc3-63a6cb98ecc1/cover.jpg	/culinary-blog/recipes/e1721eed-2286-5a6b-9dc3-63a6cb98ecc1/cover.jpg	/culinary-blog/recipes/e1721eed-2286-5a6b-9dc3-63a6cb98ecc1/cover.jpg	Món Bánh hamburger chay đơn giản, ngon miệng tại nhà! thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
dbda5c0c-4998-5848-9f7f-77b8f400e1af	dacd5de8-f548-5e96-9b09-bee5320ee3e8	/culinary-blog/recipes/dacd5de8-f548-5e96-9b09-bee5320ee3e8/cover.jpg	/culinary-blog/recipes/dacd5de8-f548-5e96-9b09-bee5320ee3e8/cover.jpg	/culinary-blog/recipes/dacd5de8-f548-5e96-9b09-bee5320ee3e8/cover.jpg	Món Cá kèo chay từ đậu phụ và rong biển giòn ngon đơn giản tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8cc671c7-c67f-58eb-8c51-f2e3a5b62504	86312047-fba9-5e2c-a441-f693b2622cce	/culinary-blog/recipes/86312047-fba9-5e2c-a441-f693b2622cce/cover.jpg	/culinary-blog/recipes/86312047-fba9-5e2c-a441-f693b2622cce/cover.jpg	/culinary-blog/recipes/86312047-fba9-5e2c-a441-f693b2622cce/cover.jpg	Món Tempura rau củ giòn rụm thơm ngon chuẩn vị Nhật Bản tại nhà cực dễ thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4f59789c-e5eb-5b48-a46a-d77e426a4444	25e20399-9bef-56eb-b205-d37f28eb4553	/culinary-blog/recipes/25e20399-9bef-56eb-b205-d37f28eb4553/cover.jpg	/culinary-blog/recipes/25e20399-9bef-56eb-b205-d37f28eb4553/cover.jpg	/culinary-blog/recipes/25e20399-9bef-56eb-b205-d37f28eb4553/cover.jpg	Món 2 cách làm đậu hũ sốt cà chua chay đơn giản dễ làm cho bữa cơm thanh đạm thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3449c5d8-9a11-526e-8164-6effdcdcc3cb	dd6da83f-f56b-5b05-9907-30a6eccf87da	/culinary-blog/recipes/dd6da83f-f56b-5b05-9907-30a6eccf87da/cover.jpg	/culinary-blog/recipes/dd6da83f-f56b-5b05-9907-30a6eccf87da/cover.jpg	/culinary-blog/recipes/dd6da83f-f56b-5b05-9907-30a6eccf87da/cover.jpg	Món Chè tàu hủ mềm mịn không thạch cao cực dễ tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
27e9d3b1-46f5-5ee7-abae-dd753e4ce86f	44719da2-3815-5f03-9ea6-9b4b6597fdd0	/culinary-blog/recipes/44719da2-3815-5f03-9ea6-9b4b6597fdd0/cover.jpg	/culinary-blog/recipes/44719da2-3815-5f03-9ea6-9b4b6597fdd0/cover.jpg	/culinary-blog/recipes/44719da2-3815-5f03-9ea6-9b4b6597fdd0/cover.jpg	Món Chè xoa xoa hạt lựu Đà Nẵng dai giòn mát lạnh giải nhiệt cực đã thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3e2c6c17-5182-5cd1-9099-64be585a6eeb	4671a59b-6982-50c5-9aa6-7785ba32450c	/culinary-blog/recipes/4671a59b-6982-50c5-9aa6-7785ba32450c/cover.jpg	/culinary-blog/recipes/4671a59b-6982-50c5-9aa6-7785ba32450c/cover.jpg	/culinary-blog/recipes/4671a59b-6982-50c5-9aa6-7785ba32450c/cover.jpg	Món Bánh trôi nước (chè trôi nước) dẻo ngon không bị cứng cực đơn giản thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
05439851-20d5-5d77-848a-33cd8cf7acda	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	/culinary-blog/recipes/5e6d38a2-9e40-5c69-a68a-fd755fa3199d/cover.jpg	/culinary-blog/recipes/5e6d38a2-9e40-5c69-a68a-fd755fa3199d/cover.jpg	/culinary-blog/recipes/5e6d38a2-9e40-5c69-a68a-fd755fa3199d/cover.jpg	Món Chè khúc bạch bằng whipping cream béo ngậy, cực dễ làm tại nhà thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5ede9dcd-4e06-5583-b05a-4f69e75f79a1	547555be-a016-527b-847c-c090af4091ac	/culinary-blog/recipes/547555be-a016-527b-847c-c090af4091ac/cover.jpg	/culinary-blog/recipes/547555be-a016-527b-847c-c090af4091ac/cover.jpg	/culinary-blog/recipes/547555be-a016-527b-847c-c090af4091ac/cover.jpg	Món Trà măng cụt chanh dây uống là ghiền bằng bình siêu tốc hiện đại thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e4cfdefe-4038-5f04-96dc-d6b2d739a5ff	635a5b95-7912-5833-8f01-376166ad87d2	/culinary-blog/recipes/635a5b95-7912-5833-8f01-376166ad87d2/cover.jpg	/culinary-blog/recipes/635a5b95-7912-5833-8f01-376166ad87d2/cover.jpg	/culinary-blog/recipes/635a5b95-7912-5833-8f01-376166ad87d2/cover.jpg	Món Nước dâu tằm thơm ngon không bị lên men để giải khát ngày hè thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1eaf281f-459f-5f31-ab7d-18bc0bb2cb59	4f40fcf1-a515-522d-848b-1535f445e73d	/culinary-blog/recipes/4f40fcf1-a515-522d-848b-1535f445e73d/cover.jpg	/culinary-blog/recipes/4f40fcf1-a515-522d-848b-1535f445e73d/cover.jpg	/culinary-blog/recipes/4f40fcf1-a515-522d-848b-1535f445e73d/cover.jpg	Món Rau má đậu xanh sữa dừa (công thức kinh doanh) thơm béo giải nhiệt thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c47ccfcf-e21e-5dc8-b65b-8bad6fb3f298	12ecd2b0-8b5a-5864-8643-b81bda0136e2	/culinary-blog/recipes/12ecd2b0-8b5a-5864-8643-b81bda0136e2/cover.jpg	/culinary-blog/recipes/12ecd2b0-8b5a-5864-8643-b81bda0136e2/cover.jpg	/culinary-blog/recipes/12ecd2b0-8b5a-5864-8643-b81bda0136e2/cover.jpg	Món Trà tắc để bán thơm ngon đắt khách, giải nhiệt ngày hè thơm ngon chuẩn vị	t	0	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1ff87765-7bf8-4c05-9d19-5725220900b5	9cf5ba46-1b6e-4925-991c-8f2ed99ecf47	/culinary-blog/categories/mon-khai-vi.jpg	\N	\N	\N	t	1	2026-11-20 10:40:31.503473+00	\N	f	\\x4f0726dffdc7614d804b2f33365a0e4c
3340d7ca-47c3-4889-b725-ebff3e1993f3	7111f1ae-df61-4e09-8bbd-f37fc54e3ebd	/culinary-blog/categories/mon-khai-vi.jpg	\N	\N	\N	t	1	2026-11-20 10:47:03.155095+00	\N	f	\\x8dbad89897936846b503b8d37c748746
60df3151-88ae-4d6f-a9b8-d3521e03ffe3	94316a16-622a-47c9-a58d-dcb00ad86454	/culinary-blog/categories/mon-khai-vi.jpg	\N	\N	\N	t	1	2026-11-20 10:48:56.744573+00	\N	f	\\x25863756bb7da641aedbbb13e96338e0
b06f5dc3-8d9d-43a4-aac7-905bcfe593fe	8fb6b8bb-aad6-4a1e-8dbc-cc9ea67452e6	/images/recipes/mon-bo-kho-chuan-vi-bo-kho-truyen-thong-dam-da-kho-cuong-cover.jpg	/images/recipes/mon-bo-kho-chuan-vi-bo-kho-truyen-thong-dam-da-kho-cuong-cover.jpg	/images/recipes/mon-bo-kho-chuan-vi-bo-kho-truyen-thong-dam-da-kho-cuong-cover.jpg	Ảnh bìa bò né	t	0	2026-11-20 11:39:25.864716+00	\N	f	\\x0000000000000001
\.


--
-- Data for Name: RecipeIngredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RecipeIngredients" ("Id", "RecipeId", "Name", "Quantity", "Unit", "Notes", "OrderIndex", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion") FROM stdin;
08eeceb5-3370-4bcc-bbc3-530c8f5b7d4e	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	Thịt heo	500.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e4fb0680-71de-4723-9d41-c61e3fe61c9c	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	Tôm tươi	300.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
caf348e4-2210-41d9-8376-9d55594bfb48	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	Khoai môn	350.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
01e60054-26d8-45aa-8a5c-2ea4e48bc0b1	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	Cà rốt	150.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f3accd74-2894-4749-9782-d897aa1fa5ec	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	Nấm mèo	80.00	gr	đã ngâm nở	4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d0d49a3f-5d76-4e07-ab8e-45ceff5618a3	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	Bún tàu khô	60.00	gr		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f5e2134b-b469-45fc-a57d-213b23728ce1	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	Hành tím	50.00	gr		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
30b3f606-e93a-4d45-9374-876daf782711	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	Tỏi	20.00	gr		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f26054a3-3be1-4965-831f-77a6a3efae42	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	Hành lá	30.00	gr		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bd16675d-b044-4ad8-b1a6-cf10d3cc7b7b	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	Bịch bánh cuốn chả giò	2.00	cái	loại bánh tráng dẻo	9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8e9572f9-c1af-44cc-86cb-4b4f757efa42	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	Bột mì	1.00	muỗng cà phê		10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
703d3169-7a52-484e-8810-287d66f6cfc0	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	Gia vị thông dụng	1.00	ít	bột nêm/ đường/ muối/ tiêu/ dầu ăn/ giấm	11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e54f2c25-dfce-462a-aa6d-9cbf9f10e795	b22a7344-85f2-5dff-abee-0dfcb97903d8	Gà	500.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b197924e-8c92-45cc-b114-a8cc4b23dd55	b22a7344-85f2-5dff-abee-0dfcb97903d8	Măng cụt	1.00	kg	vừa chín tới	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
99eae5ee-25ad-4440-9b82-84f7e0babaf1	b22a7344-85f2-5dff-abee-0dfcb97903d8	Rau răm và húng quế	50.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
875efdf0-5db3-4cb6-9ced-a490dd2de389	b22a7344-85f2-5dff-abee-0dfcb97903d8	Đậu phộng	100.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9d5633b7-face-4f3a-a6f6-8d057a7d3151	b22a7344-85f2-5dff-abee-0dfcb97903d8	Ớt	2.00	trái		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cb2bd239-79ca-4eaa-ba6d-e9bf565b0411	b22a7344-85f2-5dff-abee-0dfcb97903d8	Chanh	1.00	trái		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
119602bc-ce9d-4087-92ff-0f34ba698e8d	b22a7344-85f2-5dff-abee-0dfcb97903d8	Tỏi	3.00	củ		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
47736b7a-0b4b-4094-b954-8cb0bbe843a4	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	Thịt bò	400.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
80caf074-3966-49dc-8940-06b81b152fe8	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	Rau má	100.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3931a287-3d5d-4fe6-bd16-956a5d91a72c	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	Hành tây	1.00	củ		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
91696857-f40c-496d-b183-a6c9f484b316	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	Cà rốt	1.00	củ		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d72ee903-ec32-41f1-b9f6-2950724779c8	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	Tỏi	3.00	tép		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
75896a21-566d-47e4-87c8-4351ce370992	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	Ớt sừng	1.00	trái		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2b831bcf-7262-4078-ab54-6284441c3882	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	Tắc	6.00	quả		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c7326a75-6c2a-4c1a-887a-3aaee9d0a173	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	Rau húng lủi	1.00	ít		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ac875ac0-f049-431e-ac2f-0178339ed726	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	Đậu phộng rang	1.00	ít		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3c29b8ea-90a6-47a9-a512-533aedc3cd44	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	Hành phi	1.00	ít		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0651242b-b010-4ace-9a8c-863a82c1d51a	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	Gia vị thông dụng	1.00	ít	nước tương/ dầu ăn/ dầu hào/ nước mắm/ đường/ tương ớt/ bột ngọt/ tiêu xay	10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d46afb71-cac7-466d-970c-476b2be36ce7	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Đậu xanh	60.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bce36a10-c215-451c-9c04-1bddfd24a006	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Bánh tráng cuốn nem	400.00	gr	1 bịch	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
866303ec-c639-4427-9663-ed95195fa2a1	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Đậu hủ trắng	1.00	miếng		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3351a557-067e-42e5-9a3e-2d6cd0d0f805	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Cà rốt	200.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bd425eb7-a4e4-486c-bf61-46dafcdd3d89	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Khoai môn	400.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9a0321c5-74e1-4da9-b060-1e52c02b6bc8	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Nấm mèo	30.00	gr	mộc nhĩ	5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e6c7f897-488d-403c-a0be-bfa5bdd35075	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Củ sắn	200.00	gr	củ đậu	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d03994ef-9a7d-4651-b53d-7601b6e6f54e	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Bún tàu	50.00	gr		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c144d0f5-97cf-461e-8e8c-1fd738cf91a5	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Chanh	1.00	trái		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ab2b741e-cfc5-4c40-8480-0a7bfa2f3264	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Ớt hiểm	3.00	trái		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4383eaaf-5b3f-4709-a05d-43aec600fec3	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Hành lá	2.00	cây	hoặc hành baro	10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
fc9f84a7-5531-41d5-ac4f-13af6f162092	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Nước cốt thơm	2.00	muỗng canh	nước cốt khóm/ dứa	11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
df3e2d52-10d7-44ea-b65a-9ca391cccc67	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Gia vị thông dụng	1.00	ít	hạt nêm/ đường/ muối/ tiêu	12	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
717086a9-c0d1-426a-8065-9870314de88b	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Dầu ăn	200.00	ml		13	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3fb7faab-cdca-431e-8fd7-6c4462655106	445ef256-51b0-58aa-ba79-298d864b5f2e	Thịt ba chỉ	700.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
dd3f1f58-ad9b-485e-ba2c-33d97fa51ef1	445ef256-51b0-58aa-ba79-298d864b5f2e	Trám xanh	200.00	gr	trám trắng	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
120ff94f-d35e-4141-ac9e-ee54ebc3ef64	445ef256-51b0-58aa-ba79-298d864b5f2e	Hành khô	3.00	củ		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7c5b2759-038c-43d7-91e6-18d2c0535f61	445ef256-51b0-58aa-ba79-298d864b5f2e	Mỡ lợn	1.00	thìa canh	hoặc dầu ăn	3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bdae5b2a-7dd8-4fc5-b3f7-8d03607834ec	445ef256-51b0-58aa-ba79-298d864b5f2e	Nước màu đường	1.00	thìa canh		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
db2c7b60-d52f-4a11-abaa-6335f2be88c3	445ef256-51b0-58aa-ba79-298d864b5f2e	Ớt tươi	1.00	ít		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6149d85b-5d00-423e-9918-c799ad150433	445ef256-51b0-58aa-ba79-298d864b5f2e	Gia vị thông dụng	1.00	ít	bột nêm/ đường/ nước mắm/ hạt tiêu	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
be482248-f10b-4777-a0ae-194847ca1600	919afa90-0ae2-544c-aa7a-fab802ea448f	Miến Hàn Quốc	200.00	gr	có thể thay bằng miến dong	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
fbe53118-3c82-4e55-b85d-f5413186b6ab	919afa90-0ae2-544c-aa7a-fab802ea448f	Thịt thăn bò	200.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
68405c28-0628-4ef3-99a5-10f525fb8c64	919afa90-0ae2-544c-aa7a-fab802ea448f	Trứng gà	3.00	quả		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
76f73939-021c-4c75-9383-97b0d47501fc	919afa90-0ae2-544c-aa7a-fab802ea448f	Cải bó xôi	200.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e51d56c8-4fb5-4820-b7d4-78b58ed2551f	919afa90-0ae2-544c-aa7a-fab802ea448f	Cà rốt	100.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0fb1a65f-9811-4997-9ed9-44148a47fb60	919afa90-0ae2-544c-aa7a-fab802ea448f	Tỏi	20.00	gr		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b3e4a100-d9ca-4813-8202-385d9326aacd	919afa90-0ae2-544c-aa7a-fab802ea448f	Ngò rí	20.00	gr		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
75b2495b-5104-4a59-b981-f4dc25198861	919afa90-0ae2-544c-aa7a-fab802ea448f	Mè rang	20.00	gr		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
542089ad-2b30-4405-b2c6-86a2927f9f7f	919afa90-0ae2-544c-aa7a-fab802ea448f	Bột bắp	20.00	gr		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f76351fa-e8cd-4cc2-8c29-46460baf293b	919afa90-0ae2-544c-aa7a-fab802ea448f	Chanh	1.00	quả		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3a464ae7-946c-4bff-bee9-daeb9103af31	919afa90-0ae2-544c-aa7a-fab802ea448f	Ớt sừng	1.00	quả		10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
254a27ac-f6f9-4f01-a724-2384c81709ad	4e38d2f2-95fe-54b4-be87-08b700da58cb	Tỏi băm	1.00	ít		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
adb128d7-c182-485e-a75d-51b5eb592f04	919afa90-0ae2-544c-aa7a-fab802ea448f	Gia vị thông dụng	1.00	ít	dầu hào/ xì dầu/ tương ớt/ hạt tiêu/ đường/ hạt nêm/ dầu ăn/ muối	11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3faca336-b2b5-407d-bb76-a7c0339645ce	15585d4c-c42e-557c-8e7b-d8634962b224	Thịt bê	1.00	kg	bì nguyên tảng	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b9f9ed48-a720-42aa-a79c-4ae6e4687285	15585d4c-c42e-557c-8e7b-d8634962b224	Sả	1.00	bó		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
87772362-9ff3-49cb-b709-49e49c9ef0d6	15585d4c-c42e-557c-8e7b-d8634962b224	Gừng	50.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5666f7f5-8cf2-4436-9acb-d16ae4b98eb5	15585d4c-c42e-557c-8e7b-d8634962b224	Củ riềng/ lá tía tô	1.00	ít		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
465b11aa-9318-4c59-800f-f8391bf89b4c	15585d4c-c42e-557c-8e7b-d8634962b224	Ớt cay	1.00	quả		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ba4cea62-d12f-4df4-8f25-e8fbc5573644	15585d4c-c42e-557c-8e7b-d8634962b224	Ớt sừng	1.00	quả		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f719ae6d-9da7-44d7-b3c3-b1a6e4b321e0	15585d4c-c42e-557c-8e7b-d8634962b224	Rượu gừng	1.00	muỗng canh	hoặc rượu trắng	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5d84b729-210c-405a-95a1-87a20d181c12	15585d4c-c42e-557c-8e7b-d8634962b224	Dầu hào	1.00	muỗng canh		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b899b2bf-dc09-4a24-b81c-32eacd64c5d1	15585d4c-c42e-557c-8e7b-d8634962b224	Mè rang	1.00	ít	nếu có	8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
863736f2-ae6e-474f-a5b8-cafcaf29fd44	15585d4c-c42e-557c-8e7b-d8634962b224	Gia vị thông dụng	1.00	ít	muối hạt/ hạt nêm/ đường/ tiêu xay/ bột ngọt	9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7b78779c-0e69-4eb4-9665-02af3173a513	15585d4c-c42e-557c-8e7b-d8634962b224	Tương bần	2.00	muỗng canh	pha nước chấm	10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c48426cd-d8a0-45f3-b791-e344a373c75d	15585d4c-c42e-557c-8e7b-d8634962b224	Đậu phộng rang giã nhỏ	1.00	ít		11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
66b27592-4ba2-4206-8114-a88440004181	15585d4c-c42e-557c-8e7b-d8634962b224	Rau ăn kèm	1.00	ít	Chuối xanh/ khế chua/ dứa/ dưa chuột/ rau thơm/ bún tươi/ bánh tráng	12	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
fc8ce4a3-d434-4630-808f-cb3da9f331b9	b7389d5f-1c77-593c-b5c6-bc16e531af2d	Bún tươi	800.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8f1232be-f9e4-4f70-8134-8fab380c6338	b7389d5f-1c77-593c-b5c6-bc16e531af2d	Thịt bò	200.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
621139f5-0eb7-4d59-ad0f-e8fb5640b254	b7389d5f-1c77-593c-b5c6-bc16e531af2d	Lạc rang	100.00	gr	đậu phộng	2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
dcabf1fe-a316-402c-8f64-7a811f7cd290	b7389d5f-1c77-593c-b5c6-bc16e531af2d	Hành tím	50.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
37af393e-d8a0-4530-97ed-b312116cde30	b7389d5f-1c77-593c-b5c6-bc16e531af2d	Tỏi	40.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4b888bf9-7332-448f-a6db-9a2fcabcdeca	b7389d5f-1c77-593c-b5c6-bc16e531af2d	Ớt	1.00	quả		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1ac2ccad-9540-409d-a71b-f6e71300e585	b7389d5f-1c77-593c-b5c6-bc16e531af2d	Cà rốt	150.00	gr		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a23d4a77-927b-4cb0-9901-001a47e5493f	b7389d5f-1c77-593c-b5c6-bc16e531af2d	Đu đủ xanh	150.00	gr		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0e414d03-459f-48ec-8168-98c8ad84887f	b7389d5f-1c77-593c-b5c6-bc16e531af2d	Giá đỗ	100.00	gr		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
389a3c17-f269-4f23-8b94-9d6df1613eb7	b7389d5f-1c77-593c-b5c6-bc16e531af2d	Rau ăn kèm	1.00	ít	Rau xà lách/ Húng/ Mùi	9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5b355860-e60e-421b-87f0-bc9d69bf8f92	b7389d5f-1c77-593c-b5c6-bc16e531af2d	Gia vị thông dụng	1.00	ít	Dầu ăn/ Nước mắm/ Đường/ Dấm/ Hạt nêm/ Tiêu/ Dầu hào	10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a6ca9eca-d3be-4073-95f1-0f3bf3033941	bdc54bd9-2643-5f8c-ba0e-84d55edb94fc	Cá ngừ	400.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6ea63c37-8f7b-4898-815f-00dc206eaa30	bdc54bd9-2643-5f8c-ba0e-84d55edb94fc	Thơm	1.00	/ trái		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f0bda0f5-59fa-45b2-a7f0-3d12896628c3	bdc54bd9-2643-5f8c-ba0e-84d55edb94fc	Cà chua	2.00	trái		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
87bae8b9-8158-4eb8-a58a-d70b11e181ae	bdc54bd9-2643-5f8c-ba0e-84d55edb94fc	Bắp chuối bào	100.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a6997c9f-d0de-4ef9-898c-4df995935a2f	bdc54bd9-2643-5f8c-ba0e-84d55edb94fc	Rau nêm	1.00	ít	Sả cây/ớt hiểm/ớt bột/hành lá	4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8df25edd-5c9a-4bdd-8360-5caade2e45cd	bdc54bd9-2643-5f8c-ba0e-84d55edb94fc	Rau nêm	1.00	ít	Sả cây/ ớt hiểm/ ớt bột/ hành lá/ hành tím/ tỏi	5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0ad52e51-b035-48ad-a435-575083efc160	bdc54bd9-2643-5f8c-ba0e-84d55edb94fc	Gia vị thông dụng	1.00	ít	muối/ đường/ hạt nêm/ nước mắm/ dầu điều	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c95b238a-46d4-4404-b43d-f040423012b2	6faa4818-6400-5edd-9816-77b5450e8ed6	Bào ngư	5.00	con		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6a3325af-39d7-4101-9196-d0cfcb9370c4	6faa4818-6400-5edd-9816-77b5450e8ed6	Hải sâm khô	3.00	con		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ee2f7777-2029-4492-b761-66a697757f97	6faa4818-6400-5edd-9816-77b5450e8ed6	Vi cá	1.00	miếng		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8b38b618-ac20-46d4-9bd3-15106df3c50b	6faa4818-6400-5edd-9816-77b5450e8ed6	Sò điệp khô	100.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0b3de960-26a2-4af8-b195-f66687f93a5b	6faa4818-6400-5edd-9816-77b5450e8ed6	Nấm đông cô khô tuyết Nhật Bản	100.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ec112dbd-005a-47bc-aaae-02978323a322	6faa4818-6400-5edd-9816-77b5450e8ed6	Thịt giăm bông	200.00	gr		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b7a47893-b946-4a6b-90cd-b922567e548c	6faa4818-6400-5edd-9816-77b5450e8ed6	Gà ta	1.00	con		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b5ee9bb7-b5a3-43d2-b0be-29e8dbd0f93a	6faa4818-6400-5edd-9816-77b5450e8ed6	Hành lá	3.00	nhánh		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c8b5bf3e-566b-4195-ac95-c9d2ea472ea8	6faa4818-6400-5edd-9816-77b5450e8ed6	Gừng	1.00	củ		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
36c8e00c-3af9-4f2f-b69a-d56537219a60	6faa4818-6400-5edd-9816-77b5450e8ed6	Gia vị thông dụng	1.00	ít	tiêu sọ trắng/ trần bì/ rượu trắng	9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2d9c0fb8-0a4f-42cc-b71f-3e319afbc360	e3438f8e-7aca-5d17-b956-236640ed480e	Ốc	1.00	kg	ốc bươu/ ốc đá/ ốc vặn/ ốc nhồi...	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ed3b9881-f322-46bb-b8b8-d580aa18468d	e3438f8e-7aca-5d17-b956-236640ed480e	Bồng khoai	300.00	gr	ngó khoai	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ea12f2ab-ce3a-4adb-8add-5a1289b765d6	e3438f8e-7aca-5d17-b956-236640ed480e	Cà chua	1.00	quả		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8845d1e0-dce1-49f3-89c4-fabfccd7ea8e	e3438f8e-7aca-5d17-b956-236640ed480e	Sả	3.00	cây		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d413dbf2-8f77-4791-93f1-6c43082b495f	e3438f8e-7aca-5d17-b956-236640ed480e	Ớt sừng	1.00	quả		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b58e1bb0-d9aa-4ea8-bbbe-474a3bdddec3	e3438f8e-7aca-5d17-b956-236640ed480e	Gừng	1.00	nhánh		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
577d130f-9173-408d-98d9-48db400ef168	e3438f8e-7aca-5d17-b956-236640ed480e	Rau ngổ và mùi tàu	1.00	ít		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
04f4cdd8-b73f-4ec1-af59-081c3176c52b	e3438f8e-7aca-5d17-b956-236640ed480e	Hành tím và tỏi	1.00	ít		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ec21e2a2-d0aa-435b-aade-d6dcfc4a35c2	e3438f8e-7aca-5d17-b956-236640ed480e	Cơm mẻ	1.00	ít	1 vá nhỏ	8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bc5f99e4-199f-4738-87fd-bad7cbb44ee3	e3438f8e-7aca-5d17-b956-236640ed480e	Bột nghệ và mắm tôm	1.00	ít		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6adf4ac6-78f6-4136-881f-0bcd50c20807	e3438f8e-7aca-5d17-b956-236640ed480e	Gia vị thông dụng	1.00	ít	bột nêm/ đường/ nước mắm/ tiêu xay/ muối/ giấm	10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c0135fa1-24f4-4ef1-abeb-a4c2911fc456	2070da0c-204a-5f14-acfd-36c149358124	Măng khô	100.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
567d7123-c7a8-4514-98de-b2b3d6d14cdd	2070da0c-204a-5f14-acfd-36c149358124	Mực khô	100.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f541cb13-c7cb-476d-b519-1495d7003781	2070da0c-204a-5f14-acfd-36c149358124	Mỡ lợn	100.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
edcea81e-673f-4f69-af8f-c6c5bc9e7479	2070da0c-204a-5f14-acfd-36c149358124	Gừng	1.00	củ	nhỏ	3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4683fa7f-98a5-4596-b7d6-5f8d5d9ecd31	2070da0c-204a-5f14-acfd-36c149358124	Nước dùng gà	2.00	lít		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b0792646-3506-4da1-acf6-25eef09e50ff	2070da0c-204a-5f14-acfd-36c149358124	Rượu trắng	1.00	ít		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a56d98d1-91cf-493e-b700-e0c1951e2587	2070da0c-204a-5f14-acfd-36c149358124	Gia vị thông dụng	1.00	ít	muối/ đường/ nước mắm	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
393ba226-e61f-4464-8ccc-46d82da1dde9	afbf12f7-653a-5f1e-9a88-181afe8c6d76	Trứng cút	30.00	quả		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
dc2a97dc-f583-40a1-9dec-1735830ae16e	afbf12f7-653a-5f1e-9a88-181afe8c6d76	Thịt heo	300.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f6866dfd-da06-4222-ae3b-46ae5dbcdbe8	afbf12f7-653a-5f1e-9a88-181afe8c6d76	Tỏi/ ớt/ hành lá	1.00	ít		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5095d8de-09d4-43ae-8536-6eefb95913f4	afbf12f7-653a-5f1e-9a88-181afe8c6d76	Dầu ăn	1.00	ít		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4d430ce1-464f-4520-8f0e-2cd67ad385fa	afbf12f7-653a-5f1e-9a88-181afe8c6d76	Gia vị thông dụng	1.00	ít	nước mắm/ đường/ tương ớt	4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8f895e29-fe1f-464b-b70c-73a4c0c28f87	afbf12f7-653a-5f1e-9a88-181afe8c6d76	Ớt bột	1.00	ít	tùy chọn	5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c3fa6031-d1ea-47f8-a989-efef49d289be	96927fef-8c57-5362-8093-f3f0e230d69a	Cá trắm	1.00	kg	cắt khúc	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
90704c34-84d1-49ef-b535-e862730730cf	96927fef-8c57-5362-8093-f3f0e230d69a	Thịt ba chỉ	200.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
51ee5114-a23d-40e1-931f-e91256e08275	96927fef-8c57-5362-8093-f3f0e230d69a	Khế chua	4.00	quả		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
aba6aee2-e590-4e63-8070-eb71ca475213	96927fef-8c57-5362-8093-f3f0e230d69a	Gừng	1.00	củ		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
336a344d-59bc-43de-a91a-90ce2bfa9019	96927fef-8c57-5362-8093-f3f0e230d69a	Riềng	1.00	củ		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2ab81807-dc01-4a9f-8d6a-0af7415d458d	96927fef-8c57-5362-8093-f3f0e230d69a	Ớt cay	2.00	quả		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
606f250a-7655-4b2e-87d9-45cff6595142	96927fef-8c57-5362-8093-f3f0e230d69a	Nước hàng	3.00	thìa	nước màu	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
21988294-4218-4b11-ae18-e3ef97a16be3	96927fef-8c57-5362-8093-f3f0e230d69a	Gia vị thông dụng	1.00	ít	nước mắm/ hạt nêm/ mì chính/ đường/ muối/ bột canh/ hạt tiêu	7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e9059ecf-e60d-4aa1-b027-283741602cdc	96927fef-8c57-5362-8093-f3f0e230d69a	Muối và giấm	1.00	ít	để rửa cá	8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2d486f66-1b66-415f-baaf-4218424be44f	a6f8bcda-1250-5c08-bcbe-08addf0bf64d	Cá diếc	1.00	kg	hoặc cá trắm/ cá chép giòn...	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cdea8dc0-d9a2-49f5-b202-2262327ea6b7	a6f8bcda-1250-5c08-bcbe-08addf0bf64d	Thịt ba chỉ	300.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ad3a07f5-2423-45e4-9bef-0b9b7a6a5dee	a6f8bcda-1250-5c08-bcbe-08addf0bf64d	Dưa cải muối chua	600.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
54d4de69-a018-4ba9-936e-8313c8a0a75f	a6f8bcda-1250-5c08-bcbe-08addf0bf64d	Nước dưa chua	200.00	ml		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d7b25f05-7dde-4d4a-9c5c-0613db5c698e	a6f8bcda-1250-5c08-bcbe-08addf0bf64d	Hành khô	30.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
aa70c32e-df4b-4580-a71f-c2e303641f53	a6f8bcda-1250-5c08-bcbe-08addf0bf64d	Ớt cay	2.00	quả		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b68305e9-bc8d-462c-a2ad-2a00fcc5f19c	a6f8bcda-1250-5c08-bcbe-08addf0bf64d	Gia vị thông dụng	1.00	ít	muối hạt/ muối tinh/ mì chính/ hạt nêm/ tiêu bột/ đường/ nước mắm truyền thống/ nước hàng	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0d3970fa-f811-4f93-8e3c-1f5909e5403c	c35b1123-1f4e-54ca-8d53-7bd26828403b	Thịt heo	1.00	kg	nạc mông hoặc nạm cổ	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cbc770ed-4d08-41fb-bf69-1a5d5b516b75	c35b1123-1f4e-54ca-8d53-7bd26828403b	Sốt ướp xá xíu Cholimex	2.00	gói		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
571d4b0a-c934-4586-9a35-3dd44705f9e8	c35b1123-1f4e-54ca-8d53-7bd26828403b	Nước dừa tươi	1.00	chén		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6fecacbf-cc3c-4011-8744-327128941552	c35b1123-1f4e-54ca-8d53-7bd26828403b	Gia vị thông dụng	1.00	ít	đường/ hạt nêm/ bột ngọt/ nước tương/ dầu hào	3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
34ac8142-cfc0-4c4e-a7c3-949059826c38	c35b1123-1f4e-54ca-8d53-7bd26828403b	Rượu mai quế lộ	1.00	muỗng canh		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
16fad4e5-de07-4751-923a-6309a863a613	c35b1123-1f4e-54ca-8d53-7bd26828403b	Bột màu điều	1.00	muỗng cà phê		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
18542854-8448-4e4f-a6c1-c4b5546ab3d2	c35b1123-1f4e-54ca-8d53-7bd26828403b	Bột ngũ vị hương	1.00	/ muỗng cà phê		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f8a9978f-be6d-44c6-99bd-bc56c0a9af30	c35b1123-1f4e-54ca-8d53-7bd26828403b	Tỏi và hành tím băm nhuyễn	2.00	muỗng canh		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ad6bfc0d-bd4e-434b-87ef-b4a2836ba3ca	c35b1123-1f4e-54ca-8d53-7bd26828403b	Dầu ăn	2.00	muỗng canh		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0f655a0b-cf1c-4e7a-b061-51a907dc6b72	800e1933-2782-56a9-8745-01038b6a17a6	Thịt bò	150.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
397d573a-adfe-4163-8b06-d4f3954b05d9	800e1933-2782-56a9-8745-01038b6a17a6	Đậu bắp	450.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c4bcb59c-8a9d-4cbc-a84a-6e7852139e1e	800e1933-2782-56a9-8745-01038b6a17a6	Tỏi	6.00	tép		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2ae8616c-a817-4b79-86f2-f3ee677da6e8	800e1933-2782-56a9-8745-01038b6a17a6	Gừng	1.00	củ		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
80c78bca-425b-4672-9192-e02cc6cacddc	800e1933-2782-56a9-8745-01038b6a17a6	Gia vị thông dụng	1.00	ít	bột nêm/ dầu hào/ đường/ tiêu xay/ dầu ăn	4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a40f6f5d-8783-43b1-a1d8-8bcd7e0414d9	00e473bf-c28d-57bc-87b0-daeec99df819	Chim bồ câu	2.00	con		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5de15ad2-e600-4428-bdb5-612c07f46461	00e473bf-c28d-57bc-87b0-daeec99df819	Bánh đa	1.00	cái		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
94e0e84e-db5c-4914-b3be-d105dd7bf869	00e473bf-c28d-57bc-87b0-daeec99df819	Hành tím	2.00	củ		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3c7d4549-3405-4dce-b455-5b66d6c9cfd6	00e473bf-c28d-57bc-87b0-daeec99df819	Ớt sừng	1.00	quả		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2e246949-2085-4ccb-8918-055198239eb8	00e473bf-c28d-57bc-87b0-daeec99df819	Sả	1.00	cây		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
935b7f25-bffa-45fd-b583-c394e423cfc3	00e473bf-c28d-57bc-87b0-daeec99df819	Gia vị thông dụng	1.00	ít	nước mắm/ dầu hào/ hạt nêm/ muối/ đường/ rau răm	5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3251c090-c967-449d-b6ec-2292714b4a7a	65176e6d-dd1e-5109-87e3-044085e7a102	Thịt thăn bò Mỹ	500.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9e9c1580-7d29-4303-ae10-b4f7e8b631e4	65176e6d-dd1e-5109-87e3-044085e7a102	Sa tế tôm cay	2.00	muỗng canh		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2e468d21-cef4-47c7-b778-4457337de61d	65176e6d-dd1e-5109-87e3-044085e7a102	Rượu Thiệu Hưng	2.00	muỗng canh		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1cea20ea-a8c2-496a-9543-36479b9e65c9	65176e6d-dd1e-5109-87e3-044085e7a102	Dầu điều	3.00	muỗng canh		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ec497c9f-e3c2-4d56-9903-a2dd8ed68035	65176e6d-dd1e-5109-87e3-044085e7a102	Nước mắm ngon	1.00	muỗng canh		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d5ce52af-5bb3-4724-88bf-d1f3f3b193ff	65176e6d-dd1e-5109-87e3-044085e7a102	Xì dầu	1.00	muỗng canh		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
64263b72-fb94-4da4-94f1-e16c224dbb4e	65176e6d-dd1e-5109-87e3-044085e7a102	Hành tây	1.00	củ		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
aab00c2e-bb11-40b6-911f-199f010da126	65176e6d-dd1e-5109-87e3-044085e7a102	Đường nâu	2.00	muỗng canh		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f9ef5c44-f1e0-4ea3-bc96-9ef705563567	65176e6d-dd1e-5109-87e3-044085e7a102	Sữa đặc	3.00	muỗng canh		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3568fb24-f18c-42f0-a336-2e1b2f653408	65176e6d-dd1e-5109-87e3-044085e7a102	Sả	6.00	nhánh		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6426ff3c-79d8-4e2f-b4db-2d5fa29e3baa	65176e6d-dd1e-5109-87e3-044085e7a102	Tiêu bột	1.00	muỗng canh		10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
78c7bb2d-94d1-49f3-8c61-da0feabb04b7	65176e6d-dd1e-5109-87e3-044085e7a102	Gừng nhỏ	1.00	nhánh		11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
fa94c792-2ccf-42f6-9b7a-24ea28f621fb	65176e6d-dd1e-5109-87e3-044085e7a102	Ớt	2.00	trái		12	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
17d78c8c-a7ba-4f9f-ae42-b879a99e540f	65176e6d-dd1e-5109-87e3-044085e7a102	Hành tím	6.00	củ		13	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f016ce8d-7fe3-4d47-aece-6ade63221b19	65176e6d-dd1e-5109-87e3-044085e7a102	Tỏi	6.00	củ		14	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ee7ff2cb-0dd5-4a2e-9d8f-951e8030da31	65176e6d-dd1e-5109-87e3-044085e7a102	Chao	3.00	muỗng canh		15	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8e15c5ae-6276-4d56-96b1-a594d6b13470	65176e6d-dd1e-5109-87e3-044085e7a102	Vừng trắng rang vàng	2.00	muỗng canh		16	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b385746b-6889-4649-949f-f6f6c615477e	af6c8fb3-5c98-555c-88cd-531a8c513312	Thịt heo rừng	500.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
916dbcbd-d19e-4317-a742-514457d82949	af6c8fb3-5c98-555c-88cd-531a8c513312	Dầu ăn	1.00	muỗng canh		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b7d85a76-751a-4c9b-bf33-8630717378af	af6c8fb3-5c98-555c-88cd-531a8c513312	Dầu màu điều	1.00	ít		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c15f5024-69a4-42b1-bbe5-edb4728e1641	af6c8fb3-5c98-555c-88cd-531a8c513312	Sa tế tôm	2.00	muỗng canh		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1ec184e8-af73-4bef-8dad-8cc7ffadeca9	af6c8fb3-5c98-555c-88cd-531a8c513312	Sả cây	2.00	nhánh		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6c8170bf-0e75-4676-a4d2-62662254e2c0	af6c8fb3-5c98-555c-88cd-531a8c513312	Tỏi/ hành tím	1.00	ít		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1f9815c5-0d4a-4a22-b6cc-4e6bc2b9169c	af6c8fb3-5c98-555c-88cd-531a8c513312	Gia vị thông dụng	1.00	ít	dầu hào/ hột nêm/ nước mắm/ đường	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
761c135b-f1f1-4870-b8c8-870257a27da8	0d671484-83b8-53a4-9d47-f04c612bea06	Cánh gà	1.00	kg		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ca487c1e-86a5-463f-9c2e-972b67e06f85	0d671484-83b8-53a4-9d47-f04c612bea06	Ớt đỏ	5.00	trái		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d3429ff5-5d8e-42a1-a20f-f3a5ae29d9eb	0d671484-83b8-53a4-9d47-f04c612bea06	Ớt xanh	5.00	trái		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d6b76e8c-31f1-46fb-a390-23fbbcda516e	0d671484-83b8-53a4-9d47-f04c612bea06	Hành tím	3.00	củ		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6f2874e6-ff76-4ac9-b945-f9d6d48eb5de	0d671484-83b8-53a4-9d47-f04c612bea06	Tỏi	4.00	tép		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1481e2a1-a51a-4f7f-8e32-7fc90a2a3c2d	0d671484-83b8-53a4-9d47-f04c612bea06	Bột ớt	2.00	muỗng cà phê		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
51e92020-2c4e-48ed-a7a2-1f645714534e	0d671484-83b8-53a4-9d47-f04c612bea06	Sữa tươi không đường	2.00	muỗng canh		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c57463fd-aa60-4dfd-9e81-4ba4bb127e50	0d671484-83b8-53a4-9d47-f04c612bea06	Tương ớt	1.00	muỗng canh		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
12eaf9c7-aaca-43ce-b29d-03b84a15dc7e	0d671484-83b8-53a4-9d47-f04c612bea06	Mật ong	2.00	muỗng canh		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6d17b014-6cd8-4ec7-9280-1b42e0846dbb	0d671484-83b8-53a4-9d47-f04c612bea06	Bột nghệ	1.00	muỗng cà phê		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f541ffc7-cd85-46a1-9694-a21816b6fe4e	0d671484-83b8-53a4-9d47-f04c612bea06	Gừng	1.00	củ		10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1ee43a2d-6669-44e8-bf52-a65cdad68c37	0d671484-83b8-53a4-9d47-f04c612bea06	Lá húng lủi	50.00	gr		11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d155038a-d552-4be7-bee2-d47c199d5c68	0d671484-83b8-53a4-9d47-f04c612bea06	Nước mắm	1.00	muỗng canh		12	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
52d46e19-e897-4b3f-bf40-2d125de9c576	0d671484-83b8-53a4-9d47-f04c612bea06	Muối/ bột ngọt	1.00	ít		13	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d19328f0-a73f-4f0f-8ea7-7a1d1b578b8b	0d671484-83b8-53a4-9d47-f04c612bea06	Dầu ăn	2.00	muỗng canh		14	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
73661257-95d6-436a-b7c1-06ef2aae8a8c	0d671484-83b8-53a4-9d47-f04c612bea06	Dưa leo	1.00	quả	ăn kèm	15	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4a069484-2e17-4273-8767-878c6b5fd7e9	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	Nọng heo	300.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ec38bd4e-1949-46d8-89aa-84600adaafee	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	Hành khô	50.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
868f5147-60ec-4361-971e-6bedb9039bf8	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	Tỏi	50.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d8216e12-cad3-4b04-8b0c-e8712e5d2a1f	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	Sữa đặc	2.00	muỗng canh		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c0840e8e-3764-4df9-84ae-11a1d54ed1d5	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	Dầu ăn	1.00	ít		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f407a11d-2832-421d-a8ee-3f4abf4c6ca3	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	Gia vị thông dụng	1.00	ít	hạt nêm/ bột ngọt/ nước mắm/ dầu hào/ sa tế/ tiêu/ ngũ vị hương/ đường/ muối	5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ca395556-54a5-486f-a985-838ceb1c47bc	fca4c223-74d8-5132-af27-fbb11c02ebe9	Trứng cút	50.00	quả		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
43ec8871-1bc6-4798-b4f1-d500479d109f	fca4c223-74d8-5132-af27-fbb11c02ebe9	Quế	2.00	cây		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a3e51d2f-90d4-4bde-adcc-d2601eb89991	fca4c223-74d8-5132-af27-fbb11c02ebe9	Hạt ngò khô	1.00	muỗng cà phê		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
66d028b8-b6b9-402f-a3df-cad84c74ad69	fca4c223-74d8-5132-af27-fbb11c02ebe9	Tiểu hồi	1.00	muỗng cà phê		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f9987a7d-0318-4658-8ebf-f5e1e2971644	fca4c223-74d8-5132-af27-fbb11c02ebe9	Nụ đinh hương	1.00	muỗng cà phê		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bd2fc6d7-9f34-4212-98b7-97902510d0bf	fca4c223-74d8-5132-af27-fbb11c02ebe9	Hoa hồi	3.00	cái		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
83389579-2772-4786-a8cf-363418c5f50a	fca4c223-74d8-5132-af27-fbb11c02ebe9	Thảo  quả	3.00	quả		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9cf2f5e3-697b-4c29-a5d8-effa1cd588a5	fca4c223-74d8-5132-af27-fbb11c02ebe9	Vỏ quýt khô	1.00	miếng		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5908a52e-067d-491b-a049-177a34fdcddf	fca4c223-74d8-5132-af27-fbb11c02ebe9	Bột ngũ vị hương	1.50	muỗng cà phê		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a0e18f60-e928-4e07-8ee2-e76dfd087b1d	fca4c223-74d8-5132-af27-fbb11c02ebe9	Muối bọt	2.00	kg		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c79cbcc0-3998-47f0-9c60-caee7e5faa99	fca4c223-74d8-5132-af27-fbb11c02ebe9	Lòng trắng trứng gà	2.00	cái		10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6b8ff9b2-6b50-4577-874e-a322197c9945	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Vịt	1.00	con	Trọng lượng từ 1.8 - 2.6 kg	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c3b44bb3-0d9f-41b4-a9d6-32483bc55918	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Giấm trắng	60.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5e4ef2bb-9e5b-4dd5-8a4e-74a5fe9673e0	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Mạch nha	40.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2a083ed1-dda3-4bab-ac7b-eb5777d181b4	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Tương Hoisin	20.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8f787686-a254-4d8f-8881-2ff538dc4d35	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Tương trụ hầu	20.00	gr	Có thể thay bằng sốt xá xíu	4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d60657e7-ce49-4b3a-9dcc-822780604873	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Dầu hào	10.00	gr		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b7f6a236-f0ce-4740-b431-6bd6774a30b1	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Chao đỏ	8.00	gr		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
23141d03-968a-44f5-8461-dcbf4c0dac01	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Lá Nuyệt quế	3.00	g		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3104dd97-a49b-49bc-ab15-bef16e936bf1	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Bột sa cương	2.00	gr	Có thể thay bằng ngũ vị hương	8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
71f6b9b3-fb04-4a05-ad52-3991e17a179d	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Bột tiêu xanh	2.00	gr	Có thể thay bằng tiêu xanh	9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
95c97dfb-9d45-44cc-93d0-4b1bac211690	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Muối nở	2.00	gr	Baking soda	10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e5357965-67b9-4ac8-a37e-87acd138cd3a	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Ngũ vị hương	1.00	gr		11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9abc5e2a-5d8b-4fc1-ad5f-8f7c793a8696	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Mè rang	1.00	gr		12	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
eed23273-601a-4db5-a274-15a872ad04fa	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Rượu trắng	1.00	muỗng cà phê		13	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3e6286e2-466e-4740-8a78-07a4366d6250	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Gia vị thông dụng	1.00	ít	Muối/ Đường/ Tiêu/ Bột ngọt	14	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3ce8aa16-9dc6-4e5c-a955-fdfcf864a662	a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	Thịt heo xay	450.00	gr	nên chọn loại có 30% mỡ	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
07b69070-532c-42e7-933e-e49a3c0c2a2b	a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	Tôm tươi	225.00	gr	đã bóc vỏ	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4ffa33e1-7b8a-40f1-b11e-90395dc19cea	a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	Trứng gà	2.00	quả		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
03de269a-1cdb-4a04-a482-2cf41bb7ea29	a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	Ớt	2.00	trái	bỏ qua nếu làm cho bé	3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a8b836ff-8bfa-4d4e-aeff-5ca7def5b8df	a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	Bột năng	2.00	muỗng canh	hoặc bột bắp	4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1936bb4d-e677-4dd7-9c82-38fd0657508d	a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	Tỏi băm nhuyễn	1.00	/ muỗng canh		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
74fc9b9c-a0c5-406e-acdb-eaacf91c1804	a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	Hành lá cắt nhỏ	1.00	muỗng canh		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7e3b6ad2-8fd2-4afb-a800-fa3900693add	a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	Gia vị thông dụng	1.00	ít	hạt nêm/ đường/ nước mắm ngon/ muối/ tiêu đen xay	7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8f2e6f2d-8b69-4d13-a53f-e07c4b018ff8	0328808d-a3ff-572c-9a61-fc373949e163	Thịt ba chỉ	900.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7da765c0-8443-4fc9-bdce-013ad745f71f	0328808d-a3ff-572c-9a61-fc373949e163	Sả	5.00	nhánh		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
dbb1e82e-0ff4-4205-b2f8-7c173222ecd8	0328808d-a3ff-572c-9a61-fc373949e163	Tỏi	30.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1f7e672a-e887-4064-81f0-acbe87e85e3d	0328808d-a3ff-572c-9a61-fc373949e163	Hành tím	30.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e2ad5379-0a6b-430f-b68b-a69611b1196e	0328808d-a3ff-572c-9a61-fc373949e163	Mắm tép loại ngon	3.00	thìa canh		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b82fac34-1bd7-4a1e-bd99-fd4dd49df20b	0328808d-a3ff-572c-9a61-fc373949e163	Ớt bột không cay	1.00	thìa canh	ớt bột Hàn Quốc	5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1d1463dc-21d5-44c5-bd9b-f7a74e40337f	0328808d-a3ff-572c-9a61-fc373949e163	Dầu màu điều	1.00	thìa canh		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
38040fe1-b8aa-4cf1-af70-5defe3aed338	0328808d-a3ff-572c-9a61-fc373949e163	Gia vị thông dụng	1.00	ít	đường/ dầu ăn/ hạt nêm	7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c8b2e8a1-b120-454b-af85-5b5f0d1c298a	5d86a6bc-b484-57ad-ade8-562a33b59cfc	Cá thu	1.00	lát		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
864b9959-5074-4e2d-90f1-4c74bb9eab83	5d86a6bc-b484-57ad-ade8-562a33b59cfc	Cam	2.00	trái		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
89c920bc-b8d4-4420-89ee-5d48447dd10d	5d86a6bc-b484-57ad-ade8-562a33b59cfc	Hành tỏi băm	1.00	muỗng canh		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
803bf154-70b3-4b9d-8c63-d603b0c1dabb	5d86a6bc-b484-57ad-ade8-562a33b59cfc	Dầu ăn	1.00	ít		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
23bde6cd-a0a3-42c3-8cfa-f05a49d5b1e0	5d86a6bc-b484-57ad-ade8-562a33b59cfc	Gia vị thông dụng	1.00	ít	hạt nêm/ bột ngọt/ nước mắm/ tiêu/ đường	4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f841c3c4-d8bd-42d2-b595-3e3d3a64feb5	5d86a6bc-b484-57ad-ade8-562a33b59cfc	Hành lá	1.00	ít	trang trí	5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8613adc2-0019-4ac0-a4ce-8b3a38a27e6e	28b8f38a-632d-572c-b260-34207bfdd35f	Cua	3.00	con		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4ddf5189-cbf5-4d5d-a7ec-c765f305d8be	28b8f38a-632d-572c-b260-34207bfdd35f	Lạp xưởng	1.00	cây	thái hạt lựu	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6d849c6e-194d-479b-a072-b50389903e63	28b8f38a-632d-572c-b260-34207bfdd35f	Nấm hương	3.00	cây	thái nhỏ	2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
20f7246a-5cd2-4efb-9eed-c6db3e76a7a9	28b8f38a-632d-572c-b260-34207bfdd35f	Xôi trắng	2.00	bát	đã đồ chín	3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
82ec1704-8879-4fb9-beb0-bf6aca2eb2e6	28b8f38a-632d-572c-b260-34207bfdd35f	Hành tím	3.00	củ		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
204af46c-5882-4e7e-ad59-64e802ef29ed	28b8f38a-632d-572c-b260-34207bfdd35f	Đầu hành lá	1.00	ít	băm nhỏ	5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0b928a4b-76bf-47eb-a758-627e0a8f2178	28b8f38a-632d-572c-b260-34207bfdd35f	Gia vị thông dụng	1.00	ít	dầu hào bào ngư/ tiêu/ dầu ăn	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1642a268-785b-4fdb-8732-e72e9891bbd1	f7c4667e-40e8-5e83-97c3-1beb5319a200	Gà ta	1.80	kg		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8ba56c29-d1f8-455b-b74f-5750fe3fb39b	f7c4667e-40e8-5e83-97c3-1beb5319a200	Bầu	1.00	trái		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
742e897d-e739-490d-8998-4549ee1f3f4c	f7c4667e-40e8-5e83-97c3-1beb5319a200	Bắp ngọt	1.00	trái	bắp Mỹ	2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6b3b6823-c67d-4c87-aacd-1d648d14738f	f7c4667e-40e8-5e83-97c3-1beb5319a200	Hành lá	1.00	ít		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9d69d0e3-eba0-4492-aaa3-3d7fa55112c0	f7c4667e-40e8-5e83-97c3-1beb5319a200	Nấm đùi gà mini	200.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f48ff0f8-5407-4fb7-b90f-ae932af8aa3e	f7c4667e-40e8-5e83-97c3-1beb5319a200	Hành tây	1.00	củ		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
60e59a72-4d90-4606-a0d5-fe74ac1cfc59	f7c4667e-40e8-5e83-97c3-1beb5319a200	Nước dừa	1.00	chén	có thể thay bằng nước lọc	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6f54fa7d-30cd-4736-b596-31e4ff9828a3	f7c4667e-40e8-5e83-97c3-1beb5319a200	Hành tím và tỏi	1.00	ít		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c2bbc645-b475-474e-a609-83ad9ef5a0ba	f7c4667e-40e8-5e83-97c3-1beb5319a200	Gia vị thông dụng	1.00	ít	hạt nêm/ đường/ nước mắm/ dầu hào/ tiêu xay	8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9e374ed9-eac0-4a01-abe1-efe02e4b4e53	f7c4667e-40e8-5e83-97c3-1beb5319a200	Bột nghệ	1.00	ít	tùy chọn	9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0bdaa30b-864d-4a16-ae66-ab547dd3a874	f7c4667e-40e8-5e83-97c3-1beb5319a200	Nguyên liệu nước chấm	1.00	ít	ớt xiêm xanh/ chanh/ muối tiêu	10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8478c5e7-3292-41fc-8c66-df0e9f273334	bfd455b1-f053-5cff-8c63-b67f40072494	Mực tươi	1.00	kg		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
072ed576-18c6-46cc-8abc-3b59ad873d0f	bfd455b1-f053-5cff-8c63-b67f40072494	Gừng	1.00	củ	lớn	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ed4824a4-04ee-42fd-854d-2970109c205b	bfd455b1-f053-5cff-8c63-b67f40072494	Sả	3.00	cây		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
853d0be3-e89c-4a88-9b0a-9c4efc813add	bfd455b1-f053-5cff-8c63-b67f40072494	Hành tây	1.00	củ		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d21b16a3-1b18-4ab7-8214-2d517628c8cc	bfd455b1-f053-5cff-8c63-b67f40072494	Cần tây	1.00	bó		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
afb09b38-c081-4e41-8ae6-7f89303c6a76	bfd455b1-f053-5cff-8c63-b67f40072494	Đầu hành lá	1.00	bó		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cff42596-7965-4129-8914-54ed7340b5e3	bfd455b1-f053-5cff-8c63-b67f40072494	Ớt sừng	2.00	quả		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ad6ed405-08a9-4c0d-9009-29fb6e4f1057	bfd455b1-f053-5cff-8c63-b67f40072494	Dưa chuột	1.00	quả		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4d8167d2-c01a-4748-b8cd-173ce4c3e231	bfd455b1-f053-5cff-8c63-b67f40072494	Rau thơm	1.00	ít	lá lốt/ rau răm/ bạc hà	8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a34a60ac-8a5f-4921-8799-65c69bdd144f	bfd455b1-f053-5cff-8c63-b67f40072494	Gia vị thông dụng	1.00	ít	nước mắm/ đường/ nước cốt chanh/ tỏi/ tiêu xay	9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
96299ffd-b581-48dc-8509-1d632deaf18a	874dd168-04dc-5ff5-8b0c-46fe08b54760	Gà mái đẻ	10.00	con	khoảng 1.8kg - 2kg/con	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6d5a1f18-c94c-47e1-a54f-ef513732303d	874dd168-04dc-5ff5-8b0c-46fe08b54760	Hoa hồi	10.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
da87df73-75cb-4bab-bf7d-7d72eee4481e	874dd168-04dc-5ff5-8b0c-46fe08b54760	Thảo quả	7.00	gr	2 quả	2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9c7234d9-bd5a-4b46-b908-bfbdecbc74e0	874dd168-04dc-5ff5-8b0c-46fe08b54760	Hoa tiêu xanh	14.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7d64659f-77b9-4785-9601-bc32593bef60	874dd168-04dc-5ff5-8b0c-46fe08b54760	Hoa tiêu đỏ	10.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
dcde9f2a-0fdd-43e1-89e7-5f34b480fac8	874dd168-04dc-5ff5-8b0c-46fe08b54760	Quế thanh	10.00	gr		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
995f31b9-c5c2-469f-8c33-1c47fb5c08c0	874dd168-04dc-5ff5-8b0c-46fe08b54760	Hạt thì là	6.00	gr		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4cd3a188-c7ac-4106-90dc-0c18a33e9de8	874dd168-04dc-5ff5-8b0c-46fe08b54760	Đinh hương	6.00	gr		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a1070b19-6f26-4a09-938c-12bed6e68133	874dd168-04dc-5ff5-8b0c-46fe08b54760	Hạt ngò	10.00	gr		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9b50ee2d-a32f-46ac-90d1-e987db04a8d0	874dd168-04dc-5ff5-8b0c-46fe08b54760	Hạt mắc khén	10.00	gr		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ad9cc65b-afae-45ef-82c7-bd71463b12d8	874dd168-04dc-5ff5-8b0c-46fe08b54760	Nguyệt quế	10.00	gr		10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4efaac0d-fa10-424b-bc7e-0bce3a050d44	874dd168-04dc-5ff5-8b0c-46fe08b54760	Ớt khô	30.00	gr	khoảng 40 quả	11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
52bd503a-e953-4b0b-be62-70e5fb29fbb3	874dd168-04dc-5ff5-8b0c-46fe08b54760	Lá chanh	30.00	gr	khoảng 50 lá	12	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5f1057e3-b749-4cce-8e3c-66fa80856f6e	874dd168-04dc-5ff5-8b0c-46fe08b54760	Muối đỏ	100.00	gr		13	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
96842f16-206e-450b-80ef-1413054f21c0	874dd168-04dc-5ff5-8b0c-46fe08b54760	Tinh bột nghệ	30.00	gr		14	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8c381f23-909e-4469-a65b-7d670edfe653	874dd168-04dc-5ff5-8b0c-46fe08b54760	Tắc	1.00	ít	hoặc chanh - để sơ chế	15	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
da040957-dda9-479b-b2b4-53eeff885ffe	874dd168-04dc-5ff5-8b0c-46fe08b54760	Muối trắng	1.00	ít	để sơ chế	16	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2814a72c-1c02-4196-878c-5e5f3103f022	874dd168-04dc-5ff5-8b0c-46fe08b54760	Bột thịt gà Knorr	160.00	gr		17	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
446984e6-f744-4204-aafd-466743c8595d	874dd168-04dc-5ff5-8b0c-46fe08b54760	Cốt gà	20.00	gr		18	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0db911d5-f38d-4183-b870-1c5740866b1a	874dd168-04dc-5ff5-8b0c-46fe08b54760	Gia vị thông dụng	1.00	ít	đường vàng/ mì chính/ muối tinh/ hạt nêm	19	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c469b549-a203-46da-bb28-5b37c0be75bf	2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6	Gạo nếp	400.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
20f46aa2-0dbe-4c13-9353-0418b2ea5d72	2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6	Nghệ tươi	10.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d2da121d-1761-45dc-8f38-0f0127546f7e	2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6	Hành khô	20.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4a016c74-cf1e-4aec-9b10-61306d40eb8a	2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6	Ruốc bông	1.00	ít		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2be2fce7-b461-4aa3-8c4a-b9808353a60d	2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6	Gia vị thông dụng	1.00	ít	muối hạt/ dầu ăn	4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8943dd48-4d53-4d2a-bb49-080327e40b48	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Bánh phở	1.00	kg		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
38614dd1-4ba3-4603-9836-e8707d8fd3bc	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Thịt bò	200.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
fcc0ec22-2837-4770-aff6-dc1fa41e6f33	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Đu đủ xanh	150.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f06931af-8f53-4496-81cf-2da7721a23f4	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Cà rốt	1.00	củ		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
01ad34e1-b713-4d35-bb5e-bfc1cd019b8f	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Giá đỗ	150.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4e13b252-cb5d-4c20-b282-1518c8744954	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Đậu phộng rang	100.00	gr		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cfab84fa-6d82-4b1b-a9cd-b32175b19bf2	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Tỏi băm	4.00	muỗng cà phê		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f3c9c1b4-dd53-4aec-a2cc-9ba9236281e7	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Ớt băm	1.00	muỗng cà phê		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e9fddc54-af87-409f-a3af-ebd749721c5c	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Rau xà lách	300.00	gr		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1c79a8bc-4aad-488c-863c-a747a9c9a057	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Nước mắm	2.00	muỗng canh		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c4d3105a-30fa-4377-bc3f-288bc7d84331	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Giấm	3.00	muỗng canh		10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d38253b6-7968-4587-88e3-1161328aff0f	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Dầu hào	1.00	muỗng cà phê		11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5afd0772-6708-472e-91ca-9fad0ee40e6a	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Dầu ăn	2.00	muỗng canh		12	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6d4d8ec5-4607-45bd-aa97-f5b84797051d	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Gia vị thông dụng	1.00	ít	Hạt nêm/ Đường/ Tiêu xay	13	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9f629f31-66c0-4907-94fe-2d82029fc87b	7a541a1d-207a-515c-93c3-2424f0c1d745	Xương heo	500.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
04b2383d-369e-49c0-8240-0fada8349c27	7a541a1d-207a-515c-93c3-2424f0c1d745	Thịt xay	300.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
aac72854-cf3e-4f69-b739-7729b923e563	7a541a1d-207a-515c-93c3-2424f0c1d745	Thịt ba chỉ	300.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
80eba521-c0c4-43a5-a213-08d1f9918f26	7a541a1d-207a-515c-93c3-2424f0c1d745	Cà chua	2.00	quả		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
58958573-6115-48d1-b975-356240bbd45d	7a541a1d-207a-515c-93c3-2424f0c1d745	Sữa đặc	2.00	thìa canh		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
09fb01a4-2281-424c-b70d-d2fd01d79863	7a541a1d-207a-515c-93c3-2424f0c1d745	Nước hàng	1.00	thìa canh	nước màu đường	5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3d67026a-d182-45c5-8186-a9542ed57a62	7a541a1d-207a-515c-93c3-2424f0c1d745	Dầu hào	2.00	thìa canh		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
42981a23-96d0-4e8f-b6c3-a4fdbe81c386	7a541a1d-207a-515c-93c3-2424f0c1d745	Tỏi	1.00	củ		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8bdd8b5f-397e-4edc-b976-18a5fc534252	7a541a1d-207a-515c-93c3-2424f0c1d745	Sả	2.00	cây		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
77f4615d-27c3-4ec0-b130-83098b209eb4	7a541a1d-207a-515c-93c3-2424f0c1d745	Hành lá	1.00	ít		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2f596ed8-c51d-4a30-8744-fe3d3dc56da9	7a541a1d-207a-515c-93c3-2424f0c1d745	Hành tím	5.00	củ		10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
33b76f74-dd7f-4ea5-9e67-f8fcf66fdc39	7a541a1d-207a-515c-93c3-2424f0c1d745	Gia vị thông dụng	1.00	ít	nước mắm/ đường/ muối/ hạt nêm/ mì chính/ dầu ăn/ tiêu đen	11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8f102934-f307-4b45-b625-82310b629778	7a541a1d-207a-515c-93c3-2424f0c1d745	Món ăn chung	1.00	ít	bún tươi/ giá đỗ/ rau xà lách...	12	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c033fa16-8162-4833-9326-b0273dc2f39b	a42c812f-4e4a-5ce4-b574-d95c084350f8	Bột gạo	200.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
257d4e6e-01ed-4438-82b0-a4e95a953273	a42c812f-4e4a-5ce4-b574-d95c084350f8	Bột năng	100.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
355e19c5-ad5a-4ddc-8695-9fcb0c65be2b	a42c812f-4e4a-5ce4-b574-d95c084350f8	Tôm tươi	400.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
45edb6ec-8f44-44f2-aa64-d82a6166ca9a	a42c812f-4e4a-5ce4-b574-d95c084350f8	Thịt heo	200.00	gr	nạc dăm	3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6d3365b4-8aa8-4704-9f97-e572d7ad32e0	a42c812f-4e4a-5ce4-b574-d95c084350f8	Thịt heo băm	200.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
addcb9ca-cf0f-4183-8fd8-69497de5aef5	a42c812f-4e4a-5ce4-b574-d95c084350f8	Bì heo	100.00	gr		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
11b1f53a-c7f7-4be3-926f-e105b88ed5b0	a42c812f-4e4a-5ce4-b574-d95c084350f8	Đậu phộng rang	100.00	gr		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b9227c33-d6b2-4ede-ab55-4f7febeca15c	a42c812f-4e4a-5ce4-b574-d95c084350f8	Nước cốt dừa	200.00	ml		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
85d14c5a-7f32-4128-8590-ff94f13d6c1a	a42c812f-4e4a-5ce4-b574-d95c084350f8	Rau thơm	1.00	ít	dưa leo/ giá đỗ/ rau thơm	8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3e59120e-a441-46dd-9ccc-a5ccf3b41612	a42c812f-4e4a-5ce4-b574-d95c084350f8	Gia vị thông dụng	1.00	ít	muối/ đường/ tỏi băm/ nước mắm	9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
11ff2b9b-db36-4a70-96e6-35d219a3930e	13627a6f-e0c2-5c41-88b5-6bc66344b541	Xương cổ heo	0.50	kg		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c2d4c2f5-b54b-4f58-844c-d959ed5b3150	13627a6f-e0c2-5c41-88b5-6bc66344b541	Phèo heo non	200.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b257b078-261c-4181-a81c-520b477e5ce7	13627a6f-e0c2-5c41-88b5-6bc66344b541	Khô mực	50.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
15c734b9-9507-47d3-83ae-8604963272c2	13627a6f-e0c2-5c41-88b5-6bc66344b541	Tôm khô	30.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0c2519f6-4920-4c79-81c4-57b9c2a40885	13627a6f-e0c2-5c41-88b5-6bc66344b541	Củ cải trắng	2.00	củ		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8091723c-b550-4fb7-bf76-383c2d4808ce	13627a6f-e0c2-5c41-88b5-6bc66344b541	Cà rốt	1.00	củ		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f07af267-a676-499c-b74f-4b1ffa4d9373	13627a6f-e0c2-5c41-88b5-6bc66344b541	Rau nêm	1.00	ít	hành lá/gừng/chanh/ớt	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6b75ceda-4a0e-4f05-8720-d34c772d8bc9	13627a6f-e0c2-5c41-88b5-6bc66344b541	Gia vị thông dụng	1.00	ít	đường phèn/ muối/ hạt nêm/ bột ngọt/ đường cát/ nước mắm	7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9bb12052-310c-48d4-8f73-839fcd35f3d3	13627a6f-e0c2-5c41-88b5-6bc66344b541	Pate heo	1.00	cái		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4c8c3770-c183-4457-af08-5a76c2c24619	4e38d2f2-95fe-54b4-be87-08b700da58cb	Thịt ba chỉ heo	1.20	kg		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
856f0da8-4964-4e5b-88e0-a5493e2f7f60	4e38d2f2-95fe-54b4-be87-08b700da58cb	Gừng tươi	20.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c235b870-d0dc-4e7d-aaa4-864044af5443	4e38d2f2-95fe-54b4-be87-08b700da58cb	Sả	3.00	cây		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1438152a-f8bc-46de-98c5-7f3faeb68c5b	4e38d2f2-95fe-54b4-be87-08b700da58cb	Giấm ăn	100.00	ml		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a6ead75d-b1e0-4b24-bc52-4af7c1f75cef	4e38d2f2-95fe-54b4-be87-08b700da58cb	Muối hột	300.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ea70fb2a-eb04-449d-aab1-aef4e4412cbb	4e38d2f2-95fe-54b4-be87-08b700da58cb	Dứa băm nhỏ	150.00	gr	thơm	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
06ed8179-75f1-4787-b487-73b6f4fb2ede	4e38d2f2-95fe-54b4-be87-08b700da58cb	Mắm nêm nguyên chất	200.00	ml		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cbb7557d-a1fc-4feb-b9e3-f83400bcdcb7	4e38d2f2-95fe-54b4-be87-08b700da58cb	Gia vị thông dụng	1.00	ít	muối/ đường/ bột ngọt	8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c94c7a93-864f-4497-a14b-2b6d55d07166	4e38d2f2-95fe-54b4-be87-08b700da58cb	Đồ cuốn bánh tráng	1.00	ít	bánh tráng cuốn/ bún tươi/ rau ăn kèm	9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f6708c2c-2445-4bd8-b05a-f253777ff1f3	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	Gạo tẻ	350.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d31c780a-7430-4c9f-b4eb-64cdab090503	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	Thịt heo ba rọi	250.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cc8d1eaf-7b9d-45d0-951a-0a16c172543e	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	Chả lụa	250.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8863ae81-0b55-435a-b3a0-553a2bb1be41	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	Tôm	50.00	gr	đã lột vỏ sẵn	3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
330a0dcf-8aef-42ab-9c5f-8989ada7e5d7	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	Trứng gà	2.00	quả		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d2a65a98-235a-4ec0-ba76-13d07629ce3c	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	Dưa leo	1.00	trái		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
49d60743-493f-4b6f-a68a-9d222f0ec19f	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	Cà rốt	100.00	gr		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
16470ba0-efc0-4711-bf7a-cae9d859ff54	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	Chanh	1.00	trái		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cadb6857-3697-4ceb-8750-ef0bfe68893d	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	Rau thơm	1.00	ít	húng quế/ húng lủi/ ngò rí	8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5efb376c-3adc-41a3-b5c4-8dc4ae6740bc	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	Gia vị thông dụng	1.00	ít	tỏi/ ớt/ giấm/ đường/ hạt nêm/ nước mắm/ tiêu xay/ muối	9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
880e7e0e-9e07-4109-a90e-791bb50a1ca4	fcb19486-2256-5ad6-a6a9-729b29adcbae	Bột gạo	120.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
636260e1-4856-4886-b1f6-9de3074ce702	fcb19486-2256-5ad6-a6a9-729b29adcbae	Bột năng	30.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
428783b6-2eaa-48b7-8628-4c24b7169936	fcb19486-2256-5ad6-a6a9-729b29adcbae	Bột tàn mì	30.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
99c7eb63-9044-4c41-821c-adae573b85d3	fcb19486-2256-5ad6-a6a9-729b29adcbae	Bột bắp	1.00	muỗng cà phê		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7bb8d512-a445-406e-adb6-85853db5b05d	fcb19486-2256-5ad6-a6a9-729b29adcbae	Thịt xay	226.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f2fbb7d8-f04d-452c-a405-6bd88a85019b	fcb19486-2256-5ad6-a6a9-729b29adcbae	Trứng gà	3.00	quả		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
01b42998-05e6-44a6-89e8-dc0b0535e144	fcb19486-2256-5ad6-a6a9-729b29adcbae	Hành lá	1.00	ít		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ebc3b97e-b002-4637-8b01-9aaf316003c9	fcb19486-2256-5ad6-a6a9-729b29adcbae	Hành phi	1.00	ít		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0847886d-e6a1-40a2-8a9c-bbc613998235	fcb19486-2256-5ad6-a6a9-729b29adcbae	Sa tế	1.00	ít	tùy thích	8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9b2fc9dd-73a8-41e8-8984-c393dbad0c1c	fcb19486-2256-5ad6-a6a9-729b29adcbae	Gia vị thông dụng	1.00	ít	đường/ muối/ tiêu/ dầu ăn/ bột nêm chay/ nước tương/ dầu mè	9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
68ab7b7b-3a46-4cc4-8e26-5e85329c7ced	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Bột bánh xèo cốt dừa	500.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1c3a563e-a685-4d1b-8929-88189c984ac0	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Thịt heo xay	500.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
36701c77-213b-45ed-a01f-847a3093ee56	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Tôm	500.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a610e4b7-84fb-449a-b328-5588b2fc2fe8	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Trứng gà	2.00	quả		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
964d0743-9d34-4a79-89e9-40700f6e02c3	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Nấm hương	50.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f2d13d81-0288-4852-8499-2b8ac5e7f1ff	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Cà rốt	1.00	củ		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
fd6fb0a2-4621-418b-b58e-2b385479c2d5	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Giá	200.00	gr		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
482dba2e-5115-49d5-91c2-2fe042341766	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Hành tây	1.00	củ		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8901b796-bd97-4e7d-891a-2f5af418b86a	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Hành lá	50.00	gr		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
fc183e5d-3993-4dc2-92c0-062a48870065	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Hành tím	4.00	củ		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3a681b8e-d24a-4476-a7c9-04ddce7730b6	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Ớt	2.00	quả		10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
aa199d3d-4f12-41d0-ad06-d73504b5f982	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Tỏi	1.00	củ		11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0d1bb52d-421c-4788-8862-89b5edd8881a	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Chanh	2.00	quả		12	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b2af6761-cda6-4ce9-8caa-7911b42dbb07	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Bột nghệ	1.00	/ muỗng cà phê		13	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
35d01508-ad94-43dc-a4d3-52ca0bfa5094	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Bia	100.00	ml		14	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9af16dc6-9f10-45e4-960a-8a931f7d9745	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Giấm	2.00	muỗng cà phê		15	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c8f4d05c-7b7e-4929-85bf-9de367601943	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Dầu ăn	1.00	ít		16	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
38854aae-11d8-4d31-8622-3b23612f5a7b	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Nước mắm	4.00	muỗng canh		17	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
62bf4a5b-b476-4a7f-9ef5-21b7a0c0395a	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	Gia vị thông dụng	1.00	ít	muối/đường/tiêu/hạt nêm/bột ngọt	18	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f710893d-1422-42f6-82a1-25fca68e8839	9622b506-a920-5848-a276-56f99355fc69	Bắp bò	500.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
78e621aa-ca74-4523-b22c-47a3ca0f8697	9622b506-a920-5848-a276-56f99355fc69	Cơm mẻ	1.00	chén		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9b46debb-0f7c-4fd4-9ee7-b9c3d874a3ed	9622b506-a920-5848-a276-56f99355fc69	Mắm nêm pha sẵn	1.00	chén		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
da86d267-3865-4bb2-903a-24239df14891	9622b506-a920-5848-a276-56f99355fc69	Thơm	1.00	/ quả	dứa	3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
edc1c3d7-55df-4c85-9ae9-a45a6c35fae9	9622b506-a920-5848-a276-56f99355fc69	Hành tây	1.00	củ		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
edc4ce0e-1949-4f56-928d-a0e8f2325f05	9622b506-a920-5848-a276-56f99355fc69	Hành tím	1.00	củ		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d509b24a-0d28-40ca-aaf5-e16f549fc0d6	9622b506-a920-5848-a276-56f99355fc69	Sả	3.00	nhánh		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ad468b71-5386-4f3e-a608-7ffb0df5e0de	9622b506-a920-5848-a276-56f99355fc69	Tỏi	3.00	tép		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0386209f-cdb8-4920-a286-46b155e435ac	9622b506-a920-5848-a276-56f99355fc69	Ớt	3.00	trái		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9dd7438d-ec59-4ec8-a7c1-be829761df24	9622b506-a920-5848-a276-56f99355fc69	Chanh	1.00	/ quả		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c5a9822a-025a-431d-b253-749319f3c9a0	9622b506-a920-5848-a276-56f99355fc69	Gia vị thông dụng	1.00	ít	đường/ hạt nêm/ dầu ăn/ bột ngọt/ nước mắm/ muối	10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4398afb1-5897-417a-80bf-efb960953f23	9622b506-a920-5848-a276-56f99355fc69	Đồ ăn kèm	1.00	ít	xà lách/ dưa leo/ thơm/ rau thơm các loại/ bún tươi/ bánh tráng	11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
89d28935-6d69-42e5-8658-6c3428a43884	1ee41201-7d04-589a-9705-08cef1ff4ce3	Thịt bò	1.00	kg		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e9649efe-5d6b-4a2a-a3a0-17ead98e0ad9	1ee41201-7d04-589a-9705-08cef1ff4ce3	Thơm	1.00	/ quả	dứa	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
561da20a-608a-4b3c-a636-54978c5040c2	1ee41201-7d04-589a-9705-08cef1ff4ce3	Hành tây	1.00	củ		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b6ea91b8-d504-4103-806c-6ec5bd5ed11e	1ee41201-7d04-589a-9705-08cef1ff4ce3	Tỏi	4.00	tép		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
95cde193-93b5-47a0-b0a5-59a0e303de04	1ee41201-7d04-589a-9705-08cef1ff4ce3	Hành tím	1.00	củ		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7f0f8b26-36f5-4e16-acc6-4e063d7b2eb7	1ee41201-7d04-589a-9705-08cef1ff4ce3	Sả	2.00	nhánh		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bf4e680f-c2e3-4512-84a8-abd162870763	1ee41201-7d04-589a-9705-08cef1ff4ce3	Ớt hiểm	2.00	trái		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
aa7c42bf-b07b-4278-bbe9-97b59cab1dbb	1ee41201-7d04-589a-9705-08cef1ff4ce3	Nước dừa tươi	1.50	lít		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5f407ca1-a38e-45c0-9df0-25d2c9cbc33c	1ee41201-7d04-589a-9705-08cef1ff4ce3	Giấm	100.00	ml	dấm	8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3fd4f8a8-a53c-43eb-8ccb-3f270628f9ba	1ee41201-7d04-589a-9705-08cef1ff4ce3	Đường phèn	30.00	gr		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2758ceb8-b5e9-450b-a734-5b68ce9401bb	1ee41201-7d04-589a-9705-08cef1ff4ce3	Mắm nêm	4.00	muỗng canh		10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e5a29d13-6be6-4395-be0c-afbc5d47f662	1ee41201-7d04-589a-9705-08cef1ff4ce3	Dầu ăn	2.00	muỗng canh		11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9d5b2ee7-c862-4dfb-9c08-9d08ea04ce1f	1ee41201-7d04-589a-9705-08cef1ff4ce3	Muối/ đường	1.00	ít		12	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
18382cff-cda5-47ff-b78d-4d329f0466fb	18c4049d-bbdd-5c84-8bb4-8574700a9491	Cá lóc	1.00	con	còn gọi là cá quả - khoảng 1.1 kg	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
46933626-4de6-4f41-aae6-6a4b2ef1ec81	18c4049d-bbdd-5c84-8bb4-8574700a9491	Xương cục	400.00	gr	xương đuôi	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e4a0a1d4-d857-4e00-945e-6d6f147e2c59	18c4049d-bbdd-5c84-8bb4-8574700a9491	Hành khô	3.00	củ		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3c500ec0-6ef7-4daf-a996-1d5d6fae669f	18c4049d-bbdd-5c84-8bb4-8574700a9491	Cà chua	1.00	ít		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
de800ccd-faaf-45e7-b7eb-3ece41106652	18c4049d-bbdd-5c84-8bb4-8574700a9491	Sả nhỏ	4.00	củ		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ad8bfa02-4b9c-42f7-a72b-132fbf0f683e	18c4049d-bbdd-5c84-8bb4-8574700a9491	Ớt	1.00	trái		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3d6a443e-6457-4790-94dd-abc0adbc8543	18c4049d-bbdd-5c84-8bb4-8574700a9491	Cơm mẻ	3.00	thìa canh		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f6673f6f-989c-4ec4-8dc2-3ab254e30eea	18c4049d-bbdd-5c84-8bb4-8574700a9491	Rau ăn kèm	1.00	ít	rau cải/ ngô/ thì là...	7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4aba27dd-45ea-4213-8154-3753b49dadd8	18c4049d-bbdd-5c84-8bb4-8574700a9491	Gia vị thông dụng	1.00	ít	bột nêm/ muối/ bột ngọt/ dầu ăn/ sa tế/ tương ớt...	8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
762f600d-4913-47d0-b484-5f27dbf99308	1901526a-0fcb-5c30-905d-78addcd96622	Cua đồng	2.00	kg	đã sơ chế	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
34a169fe-3219-4730-b9ac-6777cf6a4f0e	1901526a-0fcb-5c30-905d-78addcd96622	Cà chua	700.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
91ae1121-ee49-4fcd-99ac-f8e8c9013e73	1901526a-0fcb-5c30-905d-78addcd96622	Hành khô	5.00	củ		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6ebecaa3-d4ad-49a1-a535-1b59e0aa84b4	1901526a-0fcb-5c30-905d-78addcd96622	Hành lá	50.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4b5a5bc3-97c9-40db-99c4-f92a8426fe06	1901526a-0fcb-5c30-905d-78addcd96622	Mỡ gà	1.00	ít		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7bf62f2b-7774-4539-ab1f-48d9d9085b93	1901526a-0fcb-5c30-905d-78addcd96622	Bắp bò	500.00	gr		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
570f11d5-79d2-4a48-ae97-23952d08a896	1901526a-0fcb-5c30-905d-78addcd96622	Diềm thăn giòn	500.00	gr		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2a49d2be-a0c7-4865-ad9e-41dd4200b01d	1901526a-0fcb-5c30-905d-78addcd96622	Sườn sụn non	300.00	gr		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
06df132e-1573-432d-9587-9ff42a7e005b	1901526a-0fcb-5c30-905d-78addcd96622	Ba chỉ bò Mỹ	300.00	gr		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c3a2efed-db66-4a94-b1df-d812ad256842	1901526a-0fcb-5c30-905d-78addcd96622	Váng đậu	1.00	ít		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1beca40b-62d3-48e6-a8ee-7e29f6e4cd4f	1901526a-0fcb-5c30-905d-78addcd96622	Hành phi	1.00	ít		10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0cbc6fda-dbe8-47a3-aca9-6e4ef33ad868	1901526a-0fcb-5c30-905d-78addcd96622	Nấm các loại	1.00	ít	kim châm/hải sản/đùi gà/bào ngư	11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c20ec620-4ece-4f33-90ad-26e76ba24d82	1901526a-0fcb-5c30-905d-78addcd96622	Rau thơm	1.00	ít	kinh giới/tía tô/húng láng/húng quế/rau mùi ta/xà lách	12	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
20878fc9-4df5-4279-9c61-6f0042cd3bc8	1901526a-0fcb-5c30-905d-78addcd96622	Gia vị thông dụng	1.00	ít	bột ngọt/bột canh/nước mắm	13	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c795ae9d-8de1-436a-965f-3a0ee223338b	1901526a-0fcb-5c30-905d-78addcd96622	Gia vị tiêu chanh ớt	1.00	ít	cho nước chấm	14	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a34bccc7-cee7-4e21-b87d-a8bd8b31880c	1901526a-0fcb-5c30-905d-78addcd96622	Sa tế	1.00	ít	tùy chọn	15	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5ce3af6f-b74f-4e4d-a85f-4462e64cdd16	1901526a-0fcb-5c30-905d-78addcd96622	Rau ăn kèm	1.00	ít	Rau muống/mồng tơi/khoai lang/rau đay/mướp hương/bầu/hoa chuối	16	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9e402462-5ade-463f-a3c5-093f08250475	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	Bắp cải tím	100.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e6db508d-75cb-462f-aba6-20c5d75e0221	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	Dưa leo	1.00	quả		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
76299b1f-19a7-4afd-92b9-bb3a26235072	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	Cà chua	1.00	quả		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4247c7f8-de47-4742-9d59-1bfee45f2f81	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	Rau xà lách	1.00	ít		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4a25b748-e650-4f66-9637-42b9d4107c20	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	Đậu hũ non	100.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4acd8b0a-8aa8-4f9b-b7d7-70a696905e10	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	Củ khoai môn cao	200.00	gr		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2c3e99f9-e5d8-461f-8905-243930f8cc07	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	Cọng tàu hủ ky non	100.00	gr		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4d92ddb4-fabc-402f-9932-bf8f6f038dee	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	Sườn chay	1.00	miếng		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ec0b69dd-02c6-45a2-bb00-f292e4a19b5a	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	Gốc boa rô	1.00	ít		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ff998347-7612-4ae3-9d85-7b36a7d1896c	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	Bánh mì hamburger	4.00	cái		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
20568c8d-9901-4560-a06b-a82a432269b4	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	Bột mì đa dụng	1.00	thìa canh		10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5c4a879b-2881-459d-bd4a-2ce88b7fe455	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	Gia vị thông dụng	1.00	ít	tương ớt/ muối/ đường/ giấm táo/ hạt nêm chay/ tiêu/ dầu ăn	11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9beb7a38-2cce-41b9-b6d6-18b06aa9105d	dacd5de8-f548-5e96-9b09-bee5320ee3e8	Sườn non chay	50.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4467b781-1fa5-453a-b9f6-0371015e08f2	dacd5de8-f548-5e96-9b09-bee5320ee3e8	Đậu hũ trắng	400.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0ef4b680-afe9-46f4-b93e-3874ddd5481f	dacd5de8-f548-5e96-9b09-bee5320ee3e8	Nấm kim châm	300.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d424b05d-3abe-47c3-9e0c-3bdc74c96276	dacd5de8-f548-5e96-9b09-bee5320ee3e8	Rong biển cuộn cơm	7.00	miếng		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2a71c7b0-4be0-4c43-b45b-b41cd70c2503	dacd5de8-f548-5e96-9b09-bee5320ee3e8	Bột mì	3.00	muỗng canh		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
aa579245-dbcc-46d4-b915-e73862a87af4	dacd5de8-f548-5e96-9b09-bee5320ee3e8	Bột năng	1.00	muỗng canh		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
73b041a3-cd59-4c1e-bb2c-adbe0d9a2411	dacd5de8-f548-5e96-9b09-bee5320ee3e8	Gia vị thông dụng	1.00	ít	muối/ hạt nêm chay/ tiêu xay/đường	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
57378019-c2a7-4d39-8fbd-5e6e705d5e76	86312047-fba9-5e2c-a441-f693b2622cce	Bột mì đa dụng	120.00	gr	để lạnh	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b341904f-4a0b-4cf2-9dcf-dc82860dec9b	86312047-fba9-5e2c-a441-f693b2622cce	Trứng gà lớn	1.00	quả	khoảng 50gr không tính vỏ - để lạnh	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ad3c321b-74d2-485d-85f3-940933b62544	86312047-fba9-5e2c-a441-f693b2622cce	Nước đá lạnh	200.00	ml		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5a33b27c-7e8a-4527-b2a5-73ee556e3bba	86312047-fba9-5e2c-a441-f693b2622cce	Khoai lang Nhật	1.00	củ		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0eb30b27-ba91-4a01-8395-6531c4e32f07	86312047-fba9-5e2c-a441-f693b2622cce	Bí ngô baby	1.00	/ quả		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a5a866ce-2b7f-4eac-bf77-9cba8b07e724	86312047-fba9-5e2c-a441-f693b2622cce	Ngó sen	1.00	ít	đoạn 5cm - đã gọt vỏ và luộc sơ	5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
908f4ce9-721a-4c64-b4a0-ceb774802f64	86312047-fba9-5e2c-a441-f693b2622cce	Nấm đùi gà	2.00	cây		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ea2aa236-3cf8-4ca3-871b-77c662ec481c	86312047-fba9-5e2c-a441-f693b2622cce	Cà tím nhỏ	1.00	quả		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4fe8bed3-e13c-4b2b-9f49-5c2bde3be31d	86312047-fba9-5e2c-a441-f693b2622cce	Tía tô Nhật	4.00	lá		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6468f878-43b8-47ad-81d7-f7114b0f020e	86312047-fba9-5e2c-a441-f693b2622cce	Nước dùng dashi	180.00	ml		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1dbb4d54-f8b5-4f72-9469-07164e3e9df7	86312047-fba9-5e2c-a441-f693b2622cce	Rượu mirin	2.00	muỗng canh		10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
02f63351-b9a5-418a-9db7-705eb3c36501	86312047-fba9-5e2c-a441-f693b2622cce	Gia vị thông dụng	1.00	ít	Đường/ nước tương/ dầu ăn	11	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bd8f16be-76b6-4685-8ac9-8f6503519564	25e20399-9bef-56eb-b205-d37f28eb4553	Đậu hũ chiên	3.00	miếng		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2cd27882-a22b-47b1-80ef-1207c69fef32	25e20399-9bef-56eb-b205-d37f28eb4553	Cà chua	2.00	trái		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
89bc2936-58b5-48ad-90f8-8af9e82ccea2	25e20399-9bef-56eb-b205-d37f28eb4553	Dầu ăn	2.00	muỗng canh		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
12536e6d-73e1-44ab-a906-4e6f5f734ab5	25e20399-9bef-56eb-b205-d37f28eb4553	Hạt nêm chay	2.00	muỗng cà phê		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8d351446-1d0d-4285-afa0-ca3be31586e7	25e20399-9bef-56eb-b205-d37f28eb4553	Bột ngọt	2.00	muỗng cà phê		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
690acfeb-f84b-489d-b23b-f6b0217e54f0	25e20399-9bef-56eb-b205-d37f28eb4553	Muối	1.00	muỗng cà phê		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
58e8ce7d-57f1-4988-b5fb-51098fc6f7d3	dd6da83f-f56b-5b05-9907-30a6eccf87da	Đậu nành	100.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d9877aa7-fef5-45ad-94e1-21e90d8a27b4	dd6da83f-f56b-5b05-9907-30a6eccf87da	Bột năng	40.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0ec0b3ee-0e3f-43db-b3ac-20664b391941	dd6da83f-f56b-5b05-9907-30a6eccf87da	Bột gạo	3.00	muỗng canh		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
08c1d1a5-5b7a-4c83-a1f1-5e341a1f326d	dd6da83f-f56b-5b05-9907-30a6eccf87da	Đường thốt nốt	150.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
922319ab-fd63-41d4-b18d-27bf271bc6a7	dd6da83f-f56b-5b05-9907-30a6eccf87da	Đường nho	1.00	ít		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d8c60387-7b9e-42d9-992b-3fcc4cb8444e	dd6da83f-f56b-5b05-9907-30a6eccf87da	Gừng	1.00	ít		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
515a5c67-1923-4b39-9eea-3b1cfe196e8f	dd6da83f-f56b-5b05-9907-30a6eccf87da	Lá dứa	1.00	ít		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3c16dd2d-e94f-4886-a9b1-736340497aee	44719da2-3815-5f03-9ea6-9b4b6597fdd0	Bột năng	300.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7f7b6dcd-63b2-4133-bc7c-cd9a16ef481c	44719da2-3815-5f03-9ea6-9b4b6597fdd0	Đậu xanh	50.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
af1c2dd0-2cff-48cc-a893-27c460401494	44719da2-3815-5f03-9ea6-9b4b6597fdd0	Củ dền	1.00	củ		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bac4090a-8132-4a2d-8a94-e5747a550387	44719da2-3815-5f03-9ea6-9b4b6597fdd0	Lá sương sâm	100.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
266afaab-42d9-42e3-a81f-388a0ac9e97a	44719da2-3815-5f03-9ea6-9b4b6597fdd0	Bột sương sáo	50.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a0d2b3fe-79bb-4e9c-9367-7c87f5d16d4d	44719da2-3815-5f03-9ea6-9b4b6597fdd0	Bột rau câu giòn	25.00	gr		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0c66679f-69bc-4844-8d23-a82ae4a36eae	44719da2-3815-5f03-9ea6-9b4b6597fdd0	Gia vị thông dụng	1.00	ít	đường/ muối/nước cốt dừa	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
764daca3-366a-4876-8569-c24152c7b403	4671a59b-6982-50c5-9aa6-7785ba32450c	Bột nếp	410.00	gr	nên chọn nếp Thái	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1b0f46a3-ce46-4d6b-ad18-487db9b27dbd	4671a59b-6982-50c5-9aa6-7785ba32450c	Đậu xanh	100.00	gr	đã ngâm nở	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
fac0ca42-db2f-42f7-8f2d-8a756afb3d14	4671a59b-6982-50c5-9aa6-7785ba32450c	Nước cốt dừa	500.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ee63f418-aca8-46a6-96d7-866c224cb3b8	4671a59b-6982-50c5-9aa6-7785ba32450c	Đường thốt nốt	350.00	gr	hoặc đường phên/ đường vàng...	3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9f0c33f9-9bbc-42e7-89bd-3227ca6f585f	4671a59b-6982-50c5-9aa6-7785ba32450c	Đường cát	30.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e0bf0860-364f-46c6-a955-72b9c255f245	4671a59b-6982-50c5-9aa6-7785ba32450c	Gừng tươi	30.00	gr	cắt sợi	5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f12c2793-dcde-44f0-89fe-622205cd1b62	4671a59b-6982-50c5-9aa6-7785ba32450c	Bột năng	15.00	gr		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8add73f0-89f2-4834-95b9-57dd2e621758	4671a59b-6982-50c5-9aa6-7785ba32450c	Bột gạo	10.00	gr		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
855c4c09-a26a-4737-a18f-4ec55ac4c79a	4671a59b-6982-50c5-9aa6-7785ba32450c	Muối	4.00	gr	khoảng 1/2 muỗng cà phê	8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9cbe44cd-b603-49f1-9d74-f07936775391	4671a59b-6982-50c5-9aa6-7785ba32450c	Đậu phộng và mè rang	1.00	ít	giã dập	9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4f9ef9a4-cf05-4985-8496-b26a60613777	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	Sữa tươi không đường	1.00	lít		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
07ced2f4-fd3b-4789-9c6c-84d7e2c8e552	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	Whipping cream	250.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2dbfb7aa-4e8d-4851-8a5c-bdd357f7bbfe	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	Gelatin	40.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d3a2dc32-8473-4c73-b0ad-12b988e5bea0	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	Lá dứa	1.00	ít		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ba6ab54e-23d5-4ec2-b4fb-eb40550bbe18	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	Hạnh nhân	100.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a4a4c1b2-cc28-4568-aa1d-ecae08cdcc9d	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	Va ni	4.00	ống		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3f616b7c-0ced-4cec-8a34-ed4676399cd3	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	Bột rau câu	1.00	muỗng cafe		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1f4e8aba-9be1-4b01-8c75-e770ff57a3cc	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	Bột trà xanh	2.00	muỗng cà phê		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ad5892dc-de3b-4d02-8c3d-9ea217c78a3a	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	Thanh long	1.00	miếng		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
77856382-69fe-4f94-bcaf-845c6aada1d8	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	Đường phèn	200.00	gr		9	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
11c36f8c-99a2-4bb4-86e2-2d61c0865602	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	Đường cát	300.00	gr		10	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
df764f30-0b02-4a7f-ab4c-54aa03b4c9eb	547555be-a016-527b-847c-c090af4091ac	Măng cụt tươi	500.00	gr	đã tách vỏ lấy phần thịt	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9d905072-e509-48df-86e3-edab6eca38c3	547555be-a016-527b-847c-c090af4091ac	Chanh dây tươi	100.00	gr	nước cốt	1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5d05e38e-44d0-4d1f-9b58-dd62b9c36376	547555be-a016-527b-847c-c090af4091ac	Muối	4.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9ac3c1ee-daa3-4128-b20a-eb984bc98c00	547555be-a016-527b-847c-c090af4091ac	Đường vàng	100.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8af550d5-c407-4af8-b5d1-2adc77c06c9e	547555be-a016-527b-847c-c090af4091ac	Trà xanh hoa nhài	5.00	gr		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
653966c4-58dd-47cd-a184-8cffbc83f5d0	547555be-a016-527b-847c-c090af4091ac	Nước sôi	150.00	ml	nhiệt độ khoảng 80°C để pha trà	5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0774c780-7b97-4565-b743-ad0a78fbbbca	547555be-a016-527b-847c-c090af4091ac	Sirô măng cụt	30.00	ml		6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
791aad71-c7c3-4f65-b12f-76207ae0fbd3	547555be-a016-527b-847c-c090af4091ac	Đường	10.00	ml		7	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
86872874-74bc-4959-993b-56c987e85824	547555be-a016-527b-847c-c090af4091ac	Đá viên	1.00	ít		8	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
441db099-6a6f-411b-a3bd-868607cf752c	635a5b95-7912-5833-8f01-376166ad87d2	Dâu tằm	2.00	kg		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1de51ce2-c98c-477d-80d1-b0864955f174	635a5b95-7912-5833-8f01-376166ad87d2	Đường cát	1.40	kg		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6b995566-238f-4593-b22c-b58643899625	635a5b95-7912-5833-8f01-376166ad87d2	Muối	8.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
94ce8863-7d99-46a5-901a-8564d3ff1b06	635a5b95-7912-5833-8f01-376166ad87d2	Nước lọc	150.00	ml	để pha chế	3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
835e31ab-8e7f-4cc8-820a-d67ae7cd7b9b	635a5b95-7912-5833-8f01-376166ad87d2	Tắc	1.00	quả	hoặc 10 ml nước chanh vàng	4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
33ad263b-3ddd-4844-894e-9677ed78a877	635a5b95-7912-5833-8f01-376166ad87d2	Hạt đác rim dâu tằm	1.00	ít	tùy chọn	5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
03b0b095-a4f4-471e-9255-63ed08088d10	4f40fcf1-a515-522d-848b-1535f445e73d	Đậu xanh cà vỏ	200.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c2597a46-9495-4de6-bc3f-afe2510fe57f	4f40fcf1-a515-522d-848b-1535f445e73d	Rau má	250.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2db1e806-e3e2-425f-b084-eab6183074f1	4f40fcf1-a515-522d-848b-1535f445e73d	Sữa đặc	250.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e01e8fd6-ea3e-471f-9702-34c3c8942fd7	4f40fcf1-a515-522d-848b-1535f445e73d	Bột cốt dừa	80.00	gr		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
24352055-7745-482b-98dd-8dae289ed69f	4f40fcf1-a515-522d-848b-1535f445e73d	Đá viên	1.00	ít		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d73345e4-08fb-4537-a661-7fc70f79e79e	4f40fcf1-a515-522d-848b-1535f445e73d	Gia vị thông dụng	1.00	ít	đường cát/ muối	5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
04367cf2-54bd-4030-9d68-b562b166dd93	12ecd2b0-8b5a-5864-8643-b81bda0136e2	Trà lài	30.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
53618f30-503c-4ed7-a57f-bc282ab8f61b	12ecd2b0-8b5a-5864-8643-b81bda0136e2	Hồng trà	30.00	gr		1	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
db2f33aa-1445-4724-8d03-793b23d8c2bc	12ecd2b0-8b5a-5864-8643-b81bda0136e2	Đường	500.00	gr		2	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f6db1ee4-1af4-4c9d-9e1f-ddeb5c3327f7	12ecd2b0-8b5a-5864-8643-b81bda0136e2	Muối	1.00	/ muỗng cà phê		3	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
168c63e5-f435-4033-8581-5309600c2d1e	12ecd2b0-8b5a-5864-8643-b81bda0136e2	Nước sôi	2.00	lít		4	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2f8a8e91-2702-4a40-b72f-c64de04f9b9c	12ecd2b0-8b5a-5864-8643-b81bda0136e2	Nước lọc	500.00	ml		5	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d5f220c3-8356-4109-aafd-4af06e6059b1	12ecd2b0-8b5a-5864-8643-b81bda0136e2	Tắc	1.00	ít	quất	6	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
38ee1866-c4fa-4900-8076-ac639c8ff4d6	4706ef19-ad91-4855-ac71-a904326e17e1	Gừng tươi	20.00	g	thái lát	3	2026-11-20 10:31:08.302673+00	\N	f	\\xf57d66a80c6bf04d8936d689ad13972f
68194ae0-60fa-48f6-ae57-45ecc10e1184	4706ef19-ad91-4855-ac71-a904326e17e1	Hành lá	50.00	g	cắt nhỏ	2	2026-11-20 10:31:08.302673+00	\N	f	\\xa3af032221d971499dc758d839536786
92885ece-8ee6-4386-9c75-7ac427f724d1	4706ef19-ad91-4855-ac71-a904326e17e1	Hạt nêm	1.00	muỗng cà phê		5	2026-11-20 10:31:08.302673+00	\N	f	\\xec9685c5b43ce04cbe80e2a489751776
ca757412-06fc-409c-8dc4-507b9cd8433a	4706ef19-ad91-4855-ac71-a904326e17e1	Thịt gà tươi	500.00	g	rửa sạch	1	2026-11-20 10:31:08.302673+00	\N	f	\\x425b9efbff122740ab5479eaf36ef62b
eabf04b4-f318-4d3a-9c5b-f7ba7d2d9475	4706ef19-ad91-4855-ac71-a904326e17e1	Nước mắm	2.00	muỗng canh		4	2026-11-20 10:31:08.302673+00	\N	f	\\xb0a729a8217e4c4c83aaeb775f5a97a0
0460effe-5dd2-47a9-8ea8-08543dfe33b3	9cf5ba46-1b6e-4925-991c-8f2ed99ecf47	Lá chanh tươi	10.00	lá	rửa sạch	2	2026-11-20 10:40:31.503473+00	\N	f	\\x8c11e87f98c4df48a496bdc0477edfb4
0e59e279-0973-4d0f-a705-043d00c7c6c1	9cf5ba46-1b6e-4925-991c-8f2ed99ecf47	Gà ta thả vườn	1.00	con	làm sạch	1	2026-11-20 10:40:31.503473+00	\N	f	\\x8d55045dca63ed4ca9393f7adb2b27a4
2401bf3f-e90c-4d76-9173-2c1d1984278d	9cf5ba46-1b6e-4925-991c-8f2ed99ecf47	Ớt tươi	2.00	trái	băm nhuyễn	5	2026-11-20 10:40:31.503473+00	\N	f	\\x0b6d96eba80dcd42b740944c2b2358f0
4cd8d45e-9597-47a2-ba8e-0f19853b3e90	9cf5ba46-1b6e-4925-991c-8f2ed99ecf47	Muối hạt	2.00	muỗng canh		3	2026-11-20 10:40:31.503473+00	\N	f	\\xb3513348dd278b43a15951830a133cce
a8992b8a-2b3c-46ff-8b3d-a87b773634e6	9cf5ba46-1b6e-4925-991c-8f2ed99ecf47	Hạt tiêu	1.00	muỗng cà phê	xay vỡ	4	2026-11-20 10:40:31.503473+00	\N	f	\\xc82bb88c8296f243b352a5ae6e52f29a
8ecbb144-cd81-4719-bdfd-509faa4a662d	7111f1ae-df61-4e09-8bbd-f37fc54e3ebd	Chicken	500.00	g		1	2026-11-20 10:47:03.155095+00	\N	f	\\xdece51fe545be14f841096a69b5b09a8
55163eb8-072c-463e-a215-f0d8c6a05d17	94316a16-622a-47c9-a58d-dcb00ad86454	Gà ta thả vườn	1.00	con	làm sạch	1	2026-11-20 10:48:56.744573+00	\N	f	\\xd0c50aeb556e374594b587e174f2bd90
7522c964-4689-475a-97d3-f043a0de82a3	94316a16-622a-47c9-a58d-dcb00ad86454	Muối hạt	2.00	muỗng canh		3	2026-11-20 10:48:56.744573+00	\N	f	\\x88b38a49cc8cf24e81e703a251b95678
855a5f18-41cc-4a18-803d-e4e0c5e8a718	94316a16-622a-47c9-a58d-dcb00ad86454	Ớt tươi	2.00	trái	băm nhuyễn	5	2026-11-20 10:48:56.744573+00	\N	f	\\x2a6bb97e2cbd39438ad09a0055e068eb
dd3ccbb7-7a5f-45ab-83ce-84386ea44164	94316a16-622a-47c9-a58d-dcb00ad86454	Lá chanh tươi	10.00	lá	rửa sạch	2	2026-11-20 10:48:56.744573+00	\N	f	\\x9c9aef6f3ad9cf48af890d995ccb827a
fdff3ea6-8500-48db-883a-7364f52cb32b	94316a16-622a-47c9-a58d-dcb00ad86454	Hạt tiêu	1.00	muỗng cà phê	xay vỡ	4	2026-11-20 10:48:56.744573+00	\N	f	\\x6998ced7001d5945aacc71f2f1784e61
3f28630e-a225-4c8c-ab4d-8591d073592c	8fb6b8bb-aad6-4a1e-8dbc-cc9ea67452e6	Thịt thăn bò	\N	g	Cắt lát mỏng vừa ăn	1	2026-11-20 11:39:25.346265+00	\N	f	\\x5b611a503b88c44faf6c70ebc3c20b8e
1ddcccaf-120e-46d8-97e6-fc4c435ad03c	8fb6b8bb-aad6-4a1e-8dbc-cc9ea67452e6	Phô mai mozzarella	\N	g	Bào sợi	2	2026-11-20 11:39:25.427994+00	\N	f	\\x0d6da39207f2c04980d6f5a890e0e36e
64c28449-a21e-4bd4-b30a-a5db2f58d5a1	8fb6b8bb-aad6-4a1e-8dbc-cc9ea67452e6	Bơ lạt	\N	g	Để nhiệt độ phòng	3	2026-11-20 11:39:25.467545+00	\N	f	\\x1d1f0f2b2c71bd488bfd36d492067e2b
47322898-ca26-4e11-8c7a-20c3fb25b2c9	8fb6b8bb-aad6-4a1e-8dbc-cc9ea67452e6	Tiêu đen hạt đập dập	\N	g	Rang thơm trước	4	2026-11-20 11:39:25.505015+00	\N	f	\\x43fb14238fab8649945e1248560aab3a
15753aa0-b745-4df5-a519-74d9cc01c470	8fb6b8bb-aad6-4a1e-8dbc-cc9ea67452e6	Trứng gà	\N	quả	Trứng tươi	5	2026-11-20 11:39:25.543448+00	\N	f	\\x4c0e767766a4a7489d7a8a5fdfedc951
\.


--
-- Data for Name: RecipeSteps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RecipeSteps" ("Id", "RecipeId", "StepNumber", "Title", "Description", "TimerMinutes", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion") FROM stdin;
3a2c1363-c430-427d-8f4d-8b07a8d4214b	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	1	Sơ chế thịt heo xay và tôm tươi	Thịt heo mua về rửa sạch với muối và giấm, thấm khô rồi xay nhuyễn. Tôm bóc vỏ, rửa sạch, thấm thật khô nước trước khi mang đi xay mịn để nhân không bị bở.	25	/culinary-blog/recipes/d7fe03bf-8d56-5f1c-b9e4-e0d70760050c/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e0ccce0f-4060-4c60-843a-ed743e3da213	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	2	Chuẩn bị rau củ, mộc nhĩ và miến	Băm nhỏ hành tím và tỏi, xắt nhuyễn hành lá. Mộc nhĩ (nấm mèo) ngâm nở, xắt sợi rồi băm nhẹ để giữ độ giòn. Miến (bún tàu) ngâm nước 3 phút cho mềm rồi cắt khúc ngắn.	12	/culinary-blog/recipes/d7fe03bf-8d56-5f1c-b9e4-e0d70760050c/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5cf08b71-94d2-4602-98b1-37503a531d50	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	3	Bào sợi khoai môn cao và phi thơm hành tỏi	Bào sợi khoai môn cao và cà rốt dài khoảng 3 - 4cm. Trải đều ra mẹt, hong quạt 30 phút cho ráo nước giúp chả giòn lâu. Sau đó, phi thơm hành tỏi với dầu ăn đến khi se mặt.	8	/culinary-blog/recipes/d7fe03bf-8d56-5f1c-b9e4-e0d70760050c/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
52fa17bd-79f1-4805-b92a-a6a75806cd8c	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	4	Trộn nhân và gói chả giò với bánh tráng dẻo	Cho thịt và tôm vào tô lớn, thêm 1.5 muỗng canh bột nêm gà, 1.5 muỗng canh đường, 1 muỗng cà phê muối, 1 muỗng cà phê tiêu, hành lá xắt nhuyễn và phần hành tỏi đã phi thơm vào trộn đều. Sau đó, bạn cho tiếp khoai môn, cà rốt, nấm mèo và bún tàu vào trộn thật đều tay cho nhân hòa quyện. Bạn trải miếng bánh cuốn ra theo chiều góc nhọn hướng về phía mình, múc một muỗng nhân cho vào và dàn đều. Bạn xếp góc dưới lên nhân, gập hai đầu bánh lại cho đều nhau rồi cuộn tròn. Cuối cùng, bạn dùng hỗn hợp bột mì pha một ít nước bôi vào mép để dán cuốn chả cho chắc chắn.	6	/culinary-blog/recipes/d7fe03bf-8d56-5f1c-b9e4-e0d70760050c/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
88ff0673-391c-471c-98da-c43fd505db10	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	5	Chiên ngập dầu cho cuốn chả giòn tan	Cho chả đã cuốn vào ngăn mát tủ lạnh ít nhất 30 phút để bề mặt khô ráo. Đun nóng dầu ăn đến khoảng 150 độ C rồi lần lượt cho chả vào chiên ở lửa vừa, xoay trở đều tay. Khi chả đã vàng đều, bạn tăng lửa lớn để dầu không thấm ngược vào nhân rồi vớt ra, dựng đứng trên giấy thấm dầu.	5	/culinary-blog/recipes/d7fe03bf-8d56-5f1c-b9e4-e0d70760050c/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9216b5d1-745a-41de-a498-ad05e2b4db38	d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	6	Thành phẩm	Những cuốn chả giò miền Nam vàng ươm, lớp vỏ giòn tan và không bị vỡ nát trông cực kỳ bắt mắt. Nhân bên trong đậm đà, thơm bùi vị khoai môn và ngọt tự nhiên từ tôm thịt, ăn kèm với nước mắm chua ngọt, đồ chua và rau sống sẽ tạo nên hương vị khó cưỡng.	5	/culinary-blog/recipes/d7fe03bf-8d56-5f1c-b9e4-e0d70760050c/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9f1f6734-97e4-4830-858d-760477a3965e	b22a7344-85f2-5dff-abee-0dfcb97903d8	1	Chuẩn bị nguyên liệu	Chanh mua về bạn rửa sạch, cắt làm đôi và bỏ hạt. Bạn có thể cắt chanh thành những lát mỏng để trang trí cho ly sinh tố thêm đẹp mắt nha! Đối với măng cụt, bạn dùng dao cắt ngang quả, trong quá trình cắt ấn nhẹ và xoay quanh thân quả. Khi tách được lớp vỏ phía trên ra, bạn bóc từng múi măng cụt ra nhé!	20	/culinary-blog/recipes/b22a7344-85f2-5dff-abee-0dfcb97903d8/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a4948067-f7ef-4f27-b8a2-ff06fec67588	b22a7344-85f2-5dff-abee-0dfcb97903d8	2	Xay sinh tố	Cho phần măng cụt đã chuẩn bị, 50ml whipping cream, 1 muỗng canh sữa đặc cùng 200gr đá viên vào máy xay sinh tố. Tiếp theo, bạn vắt nửa quả chanh vào cối để lấy phần nước cốt rồi bật máy và xay trong 2 phút. Khi thấy hỗn hợp đồng nhất lại với nhau là được rồi nhé!	10	/culinary-blog/recipes/b22a7344-85f2-5dff-abee-0dfcb97903d8/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
42ccdeb7-0216-449f-9ab2-7030db96737e	b22a7344-85f2-5dff-abee-0dfcb97903d8	3	Thành phẩm	Ly sinh tố măng cụt như thế là hoàn thành rồi đấy! Thật đơn giản đúng không nào? Vị ngọt chua thanh của măng cụt kết hợp với chanh cộng chút lạnh của đá, uống một ngụm sẽ cảm thấy thật ngon lành làm sao!	6	/culinary-blog/recipes/b22a7344-85f2-5dff-abee-0dfcb97903d8/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3335f378-56f4-47b8-9aa5-9789d2b59678	b22a7344-85f2-5dff-abee-0dfcb97903d8	4	Nấu chè	Bạn cho vào nồi phần nước lá dứa, nước cốt dừa, đường nâu, 100 ml nước đun sôi cho hỗn hợp hơi đặc lại thì tắt bếp. Múi măng cụt đã lăn qua bột năng bạn thả vào nồi luộc chín. Thấy bột năng trở nên trong suốt là đã chín, bạn tắt bếp vớt măng cụt ra thả vào nước sôi để nguội. Khi ăn bạn chỉ cần thả măng cụt vào hỗn hợp lá dứa và thưởng thức.	5	/culinary-blog/recipes/b22a7344-85f2-5dff-abee-0dfcb97903d8/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4e08ac92-b053-4586-9e48-9301ed404e35	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	1	Sơ chế nguyên liệu làm gỏi bò rau má	Bạn đem 400gr thịt bò đi rửa sạch bằng nước muối loãng pha thêm gừng đập dập, sau đó lau khô và cắt thành các lát mỏng vừa ăn. Rau má nhặt sạch, rửa nhiều lần với nước rồi để ráo. Cà rốt bạn gọt vỏ, bào sợi. Hành tây lột vỏ, cắt lát mỏng. Tiếp theo, bạn chuẩn bị một thau nước đá lạnh, cho cà rốt bào sợi và hành tây vào ngâm trong khoảng 15 phút để giảm vị hăng và tăng độ giòn, sau đó vớt ra để thật ráo nước.	10	/culinary-blog/recipes/2a7249a8-81a4-56c0-aaba-3b2d96272ef1/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5d1982a2-a10f-4939-b6e6-4ad89e621372	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	2	Ướp thịt bò chuẩn bị cho món nộm	Bạn cho thịt bò đã cắt vào tô, thêm vào 1/2 muỗng canh tỏi băm, 1 muỗng canh nước tương, 1 muỗng canh dầu ăn (giúp thịt mềm hơn), 1 muỗng canh dầu hào, 1 muỗng cà phê bột ngọt và 1/2 muỗng cà phê tiêu xay. Bạn trộn đều và để thịt bò thấm gia vị trong ít nhất 30 phút.	5	/culinary-blog/recipes/2a7249a8-81a4-56c0-aaba-3b2d96272ef1/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
fb7cc655-f131-4b3e-b21b-6b67c73ace78	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	3	Pha nước sốt trộn gỏi chua ngọt	Bạn cho vào chén 2 muỗng canh đường, 3 muỗng canh nước mắm, 1 muỗng canh tương ớt và 1.5 muỗng canh nước cốt tắc. Sau đó, bạn cho ớt sừng băm nhỏ vào (điều chỉnh lượng ớt tùy theo khả năng ăn cay) rồi khuấy đều cho đến khi đường tan hoàn toàn và hỗn hợp nước sốt đồng nhất.	5	/culinary-blog/recipes/2a7249a8-81a4-56c0-aaba-3b2d96272ef1/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8f602a65-132f-490f-89d2-4190a8691d81	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	1	Rang hạnh nhân	Cho 100gr hạnh nhân lát vào chảo, rang trên lửa nhỏ. Đảo đều tay đến khi hạnh nhân vàng đều và dậy mùi thơm thì tắt bếp ngay.	30	/culinary-blog/recipes/5e6d38a2-9e40-5c69-a68a-fd755fa3199d/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7ec6ab49-d894-425b-9f6b-78ee8d71394a	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	4	Xào thịt bò nhanh tay	Bạn bắc chảo lên bếp, cho 1 muỗng canh dầu ăn vào. Khi dầu nóng, bạn cho phần tỏi băm còn lại vào phi thơm. Sau đó, bạn cho thịt bò đã ướp vào xào nhanh tay trên lửa lớn trong khoảng hơn 1 phút cho đến khi thịt vừa chín tới thì tắt bếp ngay để thịt giữ được độ mềm mọng, không bị dai.	5	/culinary-blog/recipes/2a7249a8-81a4-56c0-aaba-3b2d96272ef1/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ef878bd9-c315-4c1d-a020-7dca0eb17892	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	5	Trộn gỏi rau má thịt bò	Bạn chuẩn bị một chiếc thau lớn, cho cà rốt, hành tây và rau má vào trước, sau đó cho thêm một ít rau húng lủi. Bạn cho toàn bộ phần thịt bò đã xào vào thau, rưới nước sốt lên trên. Bạn đeo bao tay nilon và trộn nhẹ tay để các nguyên liệu thấm đều nước sốt mà rau không bị dập. Cuối cùng, bạn cho đậu phộng rang và hành phi vào trộn sơ một lần nữa là hoàn thành.	5	/culinary-blog/recipes/2a7249a8-81a4-56c0-aaba-3b2d96272ef1/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
47394b4b-bdff-4ca9-9d70-bcae48ee9ef0	2a7249a8-81a4-56c0-aaba-3b2d96272ef1	6	Thành phẩm	Món gỏi bò rau má sau khi hoàn thành có màu sắc rất bắt mắt của rau má xanh mướt, cà rốt cam và thịt bò nâu bóng. Khi ăn, bạn sẽ cảm nhận được vị thịt bò mềm ngọt, rau má giòn mát hòa quyện cùng nước sốt chua ngọt cay nhẹ rất vừa miệng.	5	/culinary-blog/recipes/2a7249a8-81a4-56c0-aaba-3b2d96272ef1/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e3f86d15-18c8-4c45-92e9-94ed0062b9b7	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	1	Sơ chế nguyên liệu	Bạn cho bún tàu ra chén, đổ một lượng nước ấm ngập bún tàu và ngâm khoảng 10 - 15 phút cho bún mềm ra. Sau đó, dùng kéo cắt bún thành các khúc vừa ăn khoảng 1 ngón tay ra rây lọc cho ráo nước. Bạn ngâm với nước sôi khoảng 5 phút. Tiếp đến múc đậu hũ vào một túi vải, dùng muỗng dằm nhuyễn ra, rồi vắt đậu hũ cho ráo nước, để ra tô đựng. Đậu xanh bạn vo sạch, ngâm mềm trong nước ấm từ 2 - 3 tiếng, tách bỏ vỏ, rồi mang đi hấp khoảng 15 phút cho đậu chín mềm. Củ sắn gọt vỏ, dùng dao bào để bào củ sắn thành các sợi nhỏ, cho khoảng 1/2 muỗng cà phê muối vào, trộn đều và ngâm khoảng 5 phút. Sau đó, cho củ sắn vào túi vải, vắt ráo nước. Với cà rốt, khoai môn bạn rửa sạch, gọt bỏ vỏ và cũng sử dụng dao bào để gọt thành các sợi nhỏ. Nấm mèo ngâm với nước ấm khoảng 10 phút cho nấm mềm, cắt bỏ chân nấm. Kế tiếp, băm nhỏ nấm mèo ra. Hành lá bạn chia phần lá và phần đầu hành ra riêng, mỗi phần bạn cắt nhỏ ra.	30	/culinary-blog/recipes/d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b11c217f-d48a-4365-aaf7-c8783196b402	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	2	Xào đậu hũ và chiên khoai tây	Bắc chảo đặt lên bếp, cho từ 3 - 4 muỗng canh dầu ăn vào chảo rồi phi vàng đầu hành lá ở lửa vừa. Sau đó, đổ hành lá ra một rây lọc để chắt lấy phần dầu, còn hành được phi vàng cho ra chén đựng. Sử dụng tiếp cái chảo lúc nãy, bạn cho khoảng 2 muỗng canh dầu hành vào, rồi cho hết đậu hũ vào chảo, nêm thêm 1 muỗng cà phê hạt nêm chay, 1 muỗng cà phê đường, 1/2 muỗng cà phê tiêu, trộn đều và xào đậu hũ ở lửa vừa đến khi thấy đậu hũ săn lại thì cho ra tô. Bắc một cái chảo mới lên bếp, cho khoảng 100ml dầu ăn vào chảo, đun nóng dầu ở lửa vừa. Khi thấy dầu bắt đầu sôi, bạn cho khoai môn vào chảo, chiên vàng. Sau đó, cho khoai môn chiên ra dĩa đựng có lót giấy thấm dầu cho ráo dầu.	15	/culinary-blog/recipes/d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
695cd29d-ec8f-4608-b428-4e930428e18f	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	3	Trộn nhân chả giò	Đầu tiên, bạn cho lần lượt tất cả các nguyên liệu: khoai môn chiên, đậu hũ, nấm mèo, cà rốt, củ sắn, đậu xanh, hành phi và một ít hành lá ra khay đựng. Tiếp theo, nêm thêm vào hỗn hợp nhân 2 muỗng cà phê hạt nêm chay, 1/2 muỗng cà phê muối, 2 muỗng cà phê đường, 1/2 muỗng cà phê bột ngọt và một ít tiêu. Sau đó, dùng tay hoặc dùng đũa trộn đều các loại nhân lại với nhau.	10	/culinary-blog/recipes/d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c8e7b519-110e-4e5f-9433-799c6b7578ae	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	4	Cuốn chả giò	Bạn khuấy tan 1 muỗng canh bột mì với 2 muỗng canh nước ra chén sao cho hỗn hợp sền sệt. Tiếp theo, bạn gấp một cạnh của miếng bánh tráng lại, múc một lượng nhân vừa đủ, khoảng 1/2 muỗng canh lên chỗ nếp gấp tam giác. Sau đó, cuộn tròn lại, gấp tiếp 2 bên cạnh vào để khi chiên nhân không bị rớt ra. Để cuộn chả giò được dính chặt lại bạn thấm 1 ít nước bột mì đã pha lên mép bánh tráng dư và cố định cuốn chả lại. Cứ làm tiếp tục như vậy đến khi cuộn hết nguyên liệu.	7	/culinary-blog/recipes/d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ddb0a909-532f-4ce6-a763-e1cc680bb5bf	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	5	Chiên chả giò	Bắc chảo lên bếp, cho khoảng 200ml dầu ăn vào sao cho dầu ngập chảo và đun nóng ở lửa vừa. Khi thấy dầu bắt đầu sôi, bạn cho lần lượt chả giò vào chảo, chiên ở lửa lớn, trở đều 2 mặt cho đến khi thấy chả giò vàng đều 2 mặt thì vớt ra dĩa có lót giấy thấm dầu.	6	/culinary-blog/recipes/d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
eb5ed9b7-3c58-4f6f-9a99-810f5a59cd53	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	6	Pha nước chấm	Để pha nước chấm, bạn cho 2 muỗng canh đường, 60ml nước và 2 muỗng canh nước thơm vào chảo, khuấy đều và đun nóng ở lửa nhỏ khoảng 2 phút, tắt bếp. Đổ hỗn hợp ra chén, cho thêm 2 muỗng canh nước mắm chay, 1 muỗng cà phê nước cốt chanh, khuấy đều. Băm nhỏ ớt và cho vào trong chén nước chấm nữa là xong rồi đấy nhé.	5	/culinary-blog/recipes/d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
96e54366-5a8b-41ad-9923-6110951fae10	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	7	Thành phẩm	Chả giò thơm lừng, vàng đều. Cắn thử một miếng chả giò, bạn sẽ nghe được âm thanh giòn tan rôm rốp, nhân bên trong ngọt mát, sần sật lẫn với đậu xanh bùi bùi. Chấm thêm với nước mắm chua chua, cay cay nữa ngon hết sẩy.	5	/culinary-blog/recipes/d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a/steps/7.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cfaf979c-6cfa-4acf-b5f6-ea7b8b7ca9ca	b7389d5f-1c77-593c-b5c6-bc16e531af2d	2	Sơ chế và làm đồ chua cà rốt đu đủ	Đu đủ xanh 150gr và cà rốt 150gr gọt vỏ, rửa sạch, bào sợi nhỏ. Cho cà rốt và đu đủ vào tô, thêm 2 muỗng canh đường và 2 muỗng canh dấm. Trộn đều và ướp trong khoảng 15-20 phút để đồ chua được giòn và ngấm vị.	10	/culinary-blog/recipes/b7389d5f-1c77-593c-b5c6-bc16e531af2d/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0b44f519-d1ba-42d3-a533-1fee73bd34c8	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	8	Sơ chế nguyên liệu	Cà rốt, củ sắn rửa sạch, gọt bỏ vỏ, rồi dùng dao bào để bào thành các sợi nhỏ. Riêng với củ sắn, sau khi bào bạn cho vào túi vải, vắt cho ráo nước để khi chiên phần nhân không bị ướt. Hành tây gọt vỏ, băm nhuyễn. Còn rau mùi rửa sạch, băm nhỏ. Nấm mèo, nấm hương, váng đậu ngâm với nước ấm khoảng 15 phút cho mềm ra, rồi băm nhỏ. Với miến bạn cũng ngâm với nước ấm khoảng 7 - 10 phút cho mềm rồi vắt ráo nước, lấy kéo cắt thành các khúc nhỏ khoảng 2 - 3cm.	5	/culinary-blog/recipes/d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a/steps/8.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f3cffb87-50a0-48ac-9a4d-0a0748ac3a44	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	9	Trộn nhân	Cho đậu hũ trắng ra một tô đựng, dùng muỗng dằm nhuyễn đậu hũ ra. Kế đến, cho lần lượt củ sắn, cà rốt, hành tây, rau mùi, nấm mèo, nấm hương, váng đậu, miến đã sơ chế vào trong tô đậu hũ. Nêm thêm vào hỗn hợp nhân 2 muỗng cà phê hạt nêm chay, 1 muỗng cà phê tiêu. Sau đó, trộn đều hỗn hợp, vừa trộn vừa bóp nhẹ cho các nguyên liệu hòa quyện lại với nhau, ướp trong vòng 5 - 7 phút là được nha.	5	/culinary-blog/recipes/d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a/steps/9.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
688431c9-bc05-4237-bff2-d9778c51d395	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	10	Cuốn và chiên chả giò	Trải miếng bánh tráng ra thớt, cho khoảng 1 muỗng canh nhân chả giò ra miếng bánh tráng, gấp phần cạnh ngoài lại, rồi gấp tiếp 2 mép 2 bên, sau đó cuộn tròn lại là đã có cuốn chả giò đẹp mắt. Để cố định cuốn chả bạn có thể thoa một ít nước phần mép bánh cuối cùng của mỗi cuốn. Bắc chảo lên bếp và cho vào 2 chén dầu ăn rồi đun ở nhiệt độ trung bình. Khi dầu sôi, bạn lần lượt cho từng cuốn chả giò vào chiên khoảng 5 phút khi thấy chả vàng đều thì vớt ra để ráo dầu.	5	/culinary-blog/recipes/d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a/steps/10.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
69f0d303-e8d9-4659-9367-10b8cafb8299	d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	11	Thành phẩm	Vậy là món nem chay rán nhân thập cẩm đã hoàn thành rồi đấy. Những cuốn nem chay được cuốn chặt, đều tay, vỏ ngoài giòn rụm, nhân bên trong ngọt bùi, ăn sần sật trong miệng. Bạn có thể cuốn nem chay với một ít rau sống cho đỡ ngán, rồi chấm cùng với nước mắm chua ngọt hay nước tương dằm ớt đều ngon tròn vị đấy nhé!	5	/culinary-blog/recipes/d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a/steps/11.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
16196df1-d1d8-4c18-bfdc-8f70c1fde758	445ef256-51b0-58aa-ba79-298d864b5f2e	1	Sơ chế thịt ba chỉ	Thịt ba chỉ mua về bạn rửa sạch với nước muối loãng để khử mùi, sau đó để ráo. Dùng dao thái thịt thành những miếng to vừa ăn, tương tự kích thước món thịt kho tàu để khi kho lâu thịt không bị nát. Cho thịt vào tô lớn, ướp cùng 1 thìa canh bột nêm, 1 thìa canh đường và 2 muỗng nước mắm. Thêm hành khô, ớt và hạt tiêu đã giã dập vào trộn đều, để thịt thấm gia vị trong 30 phút.	90	/culinary-blog/recipes/445ef256-51b0-58aa-ba79-298d864b5f2e/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
635c23c4-b300-45bf-ab42-ff9b6d4d2f1f	445ef256-51b0-58aa-ba79-298d864b5f2e	2	Sơ chế quả trám	Quả trám xanh ngâm rồi rửa sạch với nước muối loãng. Bạn có thể dùng dao khứa dọc quả trám để chẻ đôi hoặc dùng chày giã dập nhẹ tùy sở thích. Giã dập tuy không đẹp mắt nhưng sẽ giúp bị chát và chua của trám tiết ra nhiều hơn, giúp món ăn ngon hơn. Sau khi giã xong, bạn cho toàn bộ phần trám này vào tô thịt đã ướp gia vị, dùng tay trộn thật đều để trám và thịt hòa quyện vào nhau.	45	/culinary-blog/recipes/445ef256-51b0-58aa-ba79-298d864b5f2e/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
52923dca-6904-4d93-b43f-800707d90ffc	445ef256-51b0-58aa-ba79-298d864b5f2e	3	Cách kho thịt với trám xanh	Bắc nồi lên bếp, làm nóng 1 thìa canh mỡ lợn rồi cho toàn bộ thịt và trám vào đảo đều ở lửa lớn. Khi thịt đã chín rắm và săn, bạn thêm 1 thìa canh nước màu đường vào đảo cùng, sau đó đổ nước lọc vào sao cho nước xăm xắp mặt thịt để bắt đầu kho. Khi nồi thịt sôi bùng lên, bạn hạ lửa nhỏ và hớt bỏ bọt. Bạn đậy nắp và kho liu riu trong khoảng 1 - 1.5 giờ cho đến khi thịt mềm nhừ, quả trám bùi và nước kho sánh lại. Lúc này, bạn nêm nếm lại cho vừa miệng rồi tắt bếp và cho thịt ra bát.	30	/culinary-blog/recipes/445ef256-51b0-58aa-ba79-298d864b5f2e/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
df85c6ee-4144-4288-86a2-a0cf72c7809b	445ef256-51b0-58aa-ba79-298d864b5f2e	4	Thành phẩm	Món thịt kho trám xanh có màu nâu vàng bóng bẩy. Thịt ba chỉ béo ngậy hòa quyện cùng vị bùi bùi, chua nhẹ của quả trám tạo nên một món ăn dân dã nhưng vô cùng bắt cơm.	22	/culinary-blog/recipes/445ef256-51b0-58aa-ba79-298d864b5f2e/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
82cfa877-7c8e-40b0-a4fe-2568f491e8b1	919afa90-0ae2-544c-aa7a-fab802ea448f	1	Sơ chế rau củ và tỏi ớt băm nhỏ	Bạn bóc vỏ tỏi rồi băm nhỏ. Cà rốt gọt vỏ, rửa sạch rồi bào sợi. Cải bó xôi rửa sạch, cắt khúc dài khoảng 5cm. Ngò rí nhặt sạch, cắt khúc 1cm. Với 1 quả ớt sừng, bạn bỏ hạt rồi cắt sợi nhỏ. Nếu thích, bạn có thể chuẩn bị thêm mộc nhĩ nấm hương để món ăn thêm phong phú.	20	/culinary-blog/recipes/919afa90-0ae2-544c-aa7a-fab802ea448f/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
51ea8803-e3e9-4682-a545-172d9207862f	919afa90-0ae2-544c-aa7a-fab802ea448f	2	Pha nước xốt trộn miến đậm đà	Bạn cho một ít dầu ăn vào chảo, phi thơm một nửa phần tỏi băm. Tiếp theo, bạn cho vào chảo các gia vị gồm: 1 muỗng canh dầu hào, 3 muỗng canh xì dầu, 2 muỗng canh tương ớt, 2 muỗng canh đường và 50ml nước lọc. Khuấy đều cho tan và đun sôi hỗn hợp, sau đó cho thêm 1 muỗng canh nước cốt chanh vào để sốt thơm hơn rồi tắt bếp, đổ ra chén để nguội.	10	/culinary-blog/recipes/919afa90-0ae2-544c-aa7a-fab802ea448f/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3421404c-2a25-4dfd-ab69-8cfb12cdd659	919afa90-0ae2-544c-aa7a-fab802ea448f	3	Ướp và làm thịt bò xào thơm mềm	Bạn thái 200gr thịt thăn bò thành miếng vừa ăn dày khoảng 0.5cm, sau đó cắt sợi. Ướp bò với 1 muỗng canh hạt nêm, tiêu, tỏi băm và một ít dầu ăn để khóa ẩm. Sau 30 phút, bạn bắc chảo lên bếp với chút dầu ăn, vặn lửa thật lớn rồi cho bò vào xào nhanh tay cho săn lại và không bị ra nước thì tắt bếp, trút ra đĩa để thật nguội.	6	/culinary-blog/recipes/919afa90-0ae2-544c-aa7a-fab802ea448f/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
69c311f9-aedc-47d8-b783-1065891b9ba3	6faa4818-6400-5edd-9816-77b5450e8ed6	6	Nấu chậm bằng cách chưng cách thủy	Bạn dùng màng bọc thực phẩm bọc thật kín miệng thố sứ, đậy nắp lại rồi đem hấp cách thủy trong 1 ngày 1 đêm thì món ăn sẽ giữ được giá trị dinh dưỡng cũng như hương vị hấp dẫn nhất.	239	/culinary-blog/recipes/6faa4818-6400-5edd-9816-77b5450e8ed6/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
001fceae-54f2-4368-8edc-c60acc3a1b92	919afa90-0ae2-544c-aa7a-fab802ea448f	4	Chế biến miến, trứng và rau củ	Bạn đun sôi một nồi nước, cho miến vào chần từ 7 - 8 phút đến khi sợi miến bấm được lõi nhưng không bị nhão thì vớt ra rổ ráo nước. Dùng kéo cắt miến cho bớt dài rồi trộn ngay với 2 muỗng canh dầu ăn và 2 muỗng canh nước sốt đã làm để sợi miến bóng, không dính. Trứng gà bạn đánh tan cùng bột bắp hòa chút nước, đem chiên thật mỏng rồi cắt sợi. Cải bó xôi chần trong 1 phút rồi ngâm nước lạnh. Cà rốt chần nhanh trong 10 giây rồi vớt ra.	5	/culinary-blog/recipes/919afa90-0ae2-544c-aa7a-fab802ea448f/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f699401e-5955-4ae1-a18c-100b642e8383	919afa90-0ae2-544c-aa7a-fab802ea448f	5	Trộn miến thập cẩm	Bạn cho cải bó xôi, cà rốt, trứng cắt sợi, miến và thịt bò vào một thố lớn. Bạn rưới thêm 3 muỗng canh nước sốt vào và trộn đều bằng tay cho thấm. Cuối cùng, bạn cho thêm ớt sừng sợi, ngò rí, mè rang và một ít hạt tiêu vào, tiếp tục trộn đều cho các nguyên liệu hòa quyện. Để tăng thêm hương vị ẩm thực Việt Nam, bạn có thể cho thêm giò lụa thái chỉ, tôm tươi hấp hoặc lạc rang giã nhỏ tùy ý.	5	/culinary-blog/recipes/919afa90-0ae2-544c-aa7a-fab802ea448f/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
79f332ed-2216-4a0e-a784-8bf241684596	919afa90-0ae2-544c-aa7a-fab802ea448f	6	Thành phẩm	Sợi miến tơi mềm, dai ngon, thấm đẫm nước sốt xì dầu và dầu hào đậm đà cùng các loại rau củ giòn ngọt và thịt bò mềm thơm. Món ăn có màu sắc bắt mắt, rất thích hợp để đổi vị cho bữa ăn mà không lo bị ngán hay tăng cân.	5	/culinary-blog/recipes/919afa90-0ae2-544c-aa7a-fab802ea448f/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bd553661-a414-44fb-9d82-e922c5e6bcc5	15585d4c-c42e-557c-8e7b-d8634962b224	1	Sơ chế và khử mùi thịt bê tươi ngon	Đầu tiên, bạn cho 1kg thịt bê vào bát lớn cùng với một ít muối hạt và 1 muỗng canh rượu gừng (hoặc rượu trắng). Dùng tay bóp và chà xát thật kỹ lên bề mặt da cũng như phần thịt bê để loại bỏ hoàn toàn mùi đặc trưng. Sau đó, rửa sạch lại thịt bê dưới vòi nước rồi để ráo.	25	/culinary-blog/recipes/15585d4c-c42e-557c-8e7b-d8634962b224/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c2ca8a48-8be3-4e5f-8bf0-18c2d6e1da92	15585d4c-c42e-557c-8e7b-d8634962b224	2	Sơ chế các nguyên liệu thơm	Với sả, bạn bóc lớp vỏ già bên ngoài, rửa sạch để lót nồi hấp. Lấy khoảng 3 - 4 nhánh sả nhỏ xắt lát mỏng để ướp thịt, phần còn lại đập dập và cắt khúc. Gừng và riềng đem rửa sạch, đập dập; một nửa băm nhỏ để chuẩn bị ướp thịt, một nửa để nguyên miếng để lót xửng hấp. Ớt cay băm nhỏ, ớt sừng xắt sợi. Lá tía tô và các loại rau ăn kèm rửa sạch và để ráo nước.	12	/culinary-blog/recipes/15585d4c-c42e-557c-8e7b-d8634962b224/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4846cfc3-5bb9-47e5-a9a8-ae6045581896	15585d4c-c42e-557c-8e7b-d8634962b224	3	Ướp thịt bê đậm đà	Bạn cho 1kg thịt bê vào tô lớn, nêm vào 1/2 muỗng canh hạt nêm, 1/2 muỗng canh đường, một ít bột ngọt, tiêu xay và 1 muỗng canh dầu hào. Tiếp theo, cho sả xắt lát, gừng băm, riềng băm và ớt băm vào. Đeo bao tay, bóp trộn đều gia vị lên từng miếng thịt và để thịt nghỉ trong khoảng 20 - 30 phút cho thấm đậm đà.	8	/culinary-blog/recipes/15585d4c-c42e-557c-8e7b-d8634962b224/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
692f34dd-dac2-4c63-8f60-e28f6f04f1e0	15585d4c-c42e-557c-8e7b-d8634962b224	4	Cuộn thịt và chuẩn bị nồi hấp	Bạn dùng dây chỉ thực phẩm cuộn thật chặt các tảng thịt bê lại để miếng thịt định hình tròn đẹp khi chín. Bạn chuẩn bị nồi hấp, đổ nước vào đáy nồi sao cho lượng nước bằng khoảng 1/2 khoảng cách từ đáy đến xửng. Tiếp theo, bạn cho bẹ sả già, sả cắt khúc, gừng và riềng đập dập trực tiếp vào phần nước này rồi đun sôi để tạo hơi nước thơm.	6	/culinary-blog/recipes/15585d4c-c42e-557c-8e7b-d8634962b224/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
48c54d18-c63c-4195-8f53-c7cd8433df5a	15585d4c-c42e-557c-8e7b-d8634962b224	5	Hấp thịt bê	Khi nước trong nồi đã sôi và bốc hơi thơm, bạn đặt xửng hấp lên, xếp các cuộn thịt bê vào. Bạn đậy nắp và hấp ở lửa vừa trong khoảng 20 phút. Khi thịt đã chín tới, bạn mở nắp, xếp toàn bộ lá tía tô phủ kín lên trên mặt thịt rồi đậy nắp hấp thêm khoảng 3 phút nữa cho tinh dầu tía tô thấm đượm vào thịt bê là có thể tắt bếp.	5	/culinary-blog/recipes/15585d4c-c42e-557c-8e7b-d8634962b224/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
15b2adc2-4e2e-4a94-a8a4-74fd19587fab	15585d4c-c42e-557c-8e7b-d8634962b224	6	Pha nước chấm tương bần chuẩn vị	Trong lúc đợi thịt chín, bạn tiến hành pha nước chấm. Cho 2 muỗng canh tương bần vào bát, thêm 1 muỗng canh đường và 1/2 muỗng cà phê bột ngọt rồi khuấy đều cho tan hoàn toàn. Sau cùng, cho gừng băm, ớt băm và đậu phộng rang giã nhỏ vào trộn đều là hoàn thành nước chấm chuẩn vị.	5	/culinary-blog/recipes/15585d4c-c42e-557c-8e7b-d8634962b224/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2261ee90-d76b-4b00-87ba-6bde1d813021	15585d4c-c42e-557c-8e7b-d8634962b224	7	Thái thịt và trình bày thành phẩm	Lấy thịt bê ra đĩa, để nguội hẳn rồi mới tháo dây chỉ và thái thành những miếng mỏng vừa ăn. Bày thịt ra mẹt hoặc đĩa cùng với bún, bánh tráng và các loại rau củ đã sơ chế. Bạn có thể rắc thêm một ít mè rang và vài sợi ớt sừng lên trên cho bắt mắt.	5	/culinary-blog/recipes/15585d4c-c42e-557c-8e7b-d8634962b224/steps/7.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5f052e02-233f-4333-a665-22f16079fead	15585d4c-c42e-557c-8e7b-d8634962b224	8	Thành phẩm	Món bê hấp tía tô đạt yêu cầu khi thịt bê chín mềm, giữ được vị ngọt tự nhiên, phần bì giòn sần sật và dậy mùi thơm đặc trưng của sả, gừng, tía tô. Khi cuốn thịt cùng bánh tráng, rau sống và chấm nước tương bần đậm đà, vị béo bùi của đậu phộng sẽ khiến món ăn trở nên vô cùng hấp dẫn.	5	/culinary-blog/recipes/15585d4c-c42e-557c-8e7b-d8634962b224/steps/8.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f785ddd4-caa1-4dbc-85f0-54cd781cb66b	b7389d5f-1c77-593c-b5c6-bc16e531af2d	1	Làm hành phi giòn rụm	Hành tím 50gr rửa sạch, thái mỏng. Cho dầu ăn vào chảo, đun nóng già (kiểm tra bằng cách thả một lát hành vào, nếu hành nổi lên và sôi mạnh là được). Cho hết hành vào, phi ở lửa lớn đến khi hành chuyển sang màu vàng nhạt khoảng 80%. Vớt hành ra rây lọc dầu ngay lập tức. Hành còn nóng sẽ tiếp tục vàng thêm, nên đừng phi quá vàng để tránh bị cháy. Hành phi đạt yêu cầu sẽ giòn tan và thơm lừng.	20	/culinary-blog/recipes/b7389d5f-1c77-593c-b5c6-bc16e531af2d/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3f57075f-b378-4584-8be1-277a4aa4abb9	4706ef19-ad91-4855-ac71-a904326e17e1	2	Ướp gia vị	Ướp gà với nước mắm và hạt nêm	10	/culinary-blog/categories/mon-khai-vi.jpg	2026-11-20 10:31:08.302673+00	\N	f	\\x3d4b1ca8ac544140a4ee91056f4bf063
f974e008-c6b8-4d65-b10e-49b580dec3fc	b7389d5f-1c77-593c-b5c6-bc16e531af2d	3	Ướp thịt bò xào thơm lừng	Tỏi 40gr bóc vỏ, đập dập và băm nhỏ. Ớt 1 quả băm nhỏ. Thịt bò 200gr thái thành các miếng mỏng vừa ăn. Ướp thịt bò với 1 thìa cà phê dầu hào, 1/2 thìa cà phê hạt nêm, một chút tiêu và một phần tỏi băm. Trộn đều và ướp trong khoảng 10 phút cho thịt ngấm gia vị.	6	/culinary-blog/recipes/b7389d5f-1c77-593c-b5c6-bc16e531af2d/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
774cecc0-5e6a-4781-8439-0bdf90fc76e2	b7389d5f-1c77-593c-b5c6-bc16e531af2d	4	Chuẩn bị lạc rang và các loại rau sống ăn kèm	Lạc rang 100gr (đậu phộng) giã dập sau khi đã rang chín và tách vỏ. Giá đỗ 100gr rửa sạch, để ráo nước. Rau xà lách, rau húng, rau mùi rửa sạch, để ráo. Xà lách thái khúc vừa ăn.	5	/culinary-blog/recipes/b7389d5f-1c77-593c-b5c6-bc16e531af2d/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bd5b90fd-6a8e-4acd-908d-aaff308ebf00	b7389d5f-1c77-593c-b5c6-bc16e531af2d	5	Pha nước mắm chua ngọt chuẩn vị	Trong một tô, cho 2 muỗng canh nước mắm, 2 muỗng canh đường, 1 muỗng canh dấm. Thêm 4-6 muỗng canh nước nóng (tùy độ đậm nhạt của nước mắm bạn dùng). Khuấy đều cho đường tan hết. Khi nước mắm đã nguội, cho 1/2 lượng tỏi băm còn lại và ớt băm vào.	5	/culinary-blog/recipes/b7389d5f-1c77-593c-b5c6-bc16e531af2d/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
49aeee88-21fb-4b6a-bbbc-09616acb38c3	b7389d5f-1c77-593c-b5c6-bc16e531af2d	6	Xào thịt bò và giá đỗ	Cho 1 muỗng canh dầu ăn (có thể dùng dầu phi hành để món ăn thơm hơn) vào chảo. Phi thơm phần tỏi băm còn lại. Khi tỏi thơm, cho thịt bò đã ướp vào xào nhanh trên lửa lớn. Xào đến khi thịt bò chín tái thì cho giá đỗ vào, đảo đều cho giá vừa chín tới. Vì thịt bò đã ướp gia vị nên không cần nêm thêm. Tắt bếp ngay khi thịt và giá vừa chín để giữ độ mềm ngọt và giòn.	5	/culinary-blog/recipes/b7389d5f-1c77-593c-b5c6-bc16e531af2d/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d924bc88-4722-4666-8875-75c49bebfdde	b7389d5f-1c77-593c-b5c6-bc16e531af2d	7	Hoàn thành tô bún bò trộn hấp dẫn	Cho một ít rau xà lách thái khúc xuống đáy tô. Tiếp theo, cho khoảng 200-250gr bún tươi lên trên. Xếp thịt bò xào giá, đồ chua (cà rốt, đu đủ), rau sống ăn kèm (húng, mùi), lạc rang và hành phi lên trên.	5	/culinary-blog/recipes/b7389d5f-1c77-593c-b5c6-bc16e531af2d/steps/7.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
93517878-744a-46cd-af0b-89dabfaa7e3d	b7389d5f-1c77-593c-b5c6-bc16e531af2d	8	Thành phẩm	Khi thưởng thức, bạn chỉ cần rưới phần nước mắm chua ngọt đã pha lên trên, trộn đều và tận hưởng hương vị tuyệt vời của món bún bò trộn. Vị chua ngọt cay cay của nước mắm hòa quyện cùng bún dai, thịt bò mềm thơm, đồ chua giòn sần sật, rau sống thanh mát và lạc rang, hành phi bùi béo sẽ khiến bạn mê mẩn!	5	/culinary-blog/recipes/b7389d5f-1c77-593c-b5c6-bc16e531af2d/steps/8.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
417c6bc4-594d-4ae8-b13c-ff31c544540f	bdc54bd9-2643-5f8c-ba0e-84d55edb94fc	1	Sơ chế và ướp cá ngừ	Giã nhuyễn đầu hành trắng, ớt hiểm, ớt bột, muối và hạt nêm. Ướp hỗn hợp này vào cá trong 5 phút để cá thấm vị và khử mùi tanh cá hiệu quả.	15	/culinary-blog/recipes/bdc54bd9-2643-5f8c-ba0e-84d55edb94fc/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
aa8c7e4f-4fc6-44aa-b2fd-5a25f7282911	bdc54bd9-2643-5f8c-ba0e-84d55edb94fc	2	Sơ chế rau củ	Cà chua cắt múi cau, thơm cắt lát dày khoảng 5 đến 7 ly. Hành lá cắt khúc, sả cây đập dập rồi cắt khúc.	7	/culinary-blog/recipes/bdc54bd9-2643-5f8c-ba0e-84d55edb94fc/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2573ea05-9874-4197-a11b-fedd0fa01be6	bdc54bd9-2643-5f8c-ba0e-84d55edb94fc	3	Xào cá và nấu canh chua	Phi thơm sả, hành tỏi băm với dầu điều, cho cá vào xào săn. Thêm 1.2 lít nước sôi, nêm gia vị, cho thơm và cà chua vào nấu chín. Cuối cùng cho bắp chuối bào, hành lá và một muỗng canh nước mắm rồi tắt bếp.	5	/culinary-blog/recipes/bdc54bd9-2643-5f8c-ba0e-84d55edb94fc/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
afca6c9c-57f0-4b5f-bef0-bc03291275b9	bdc54bd9-2643-5f8c-ba0e-84d55edb94fc	4	Thành phẩm	Món canh có màu sắc bắt mắt, vị chua ngọt hài hòa, thịt cá ngừ tươi ngon không bị bở, dùng kèm với cơm nóng hoặc bún đều rất tuyệt.	5	/culinary-blog/recipes/bdc54bd9-2643-5f8c-ba0e-84d55edb94fc/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
aa84678f-4bf8-41fe-ae30-f4fc793dbecc	6faa4818-6400-5edd-9816-77b5450e8ed6	1	Sơ chế bào ngư và hải sản	Bạn đun sôi một nồi nước, thêm hành lá và vài lát gừng vào rồi cho bào ngư vào luộc sơ. Sau khi bào ngư nguội, bạn tiến hành tách lấy phần thịt ra khỏi vỏ để riêng.	1439	/culinary-blog/recipes/6faa4818-6400-5edd-9816-77b5450e8ed6/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
65b95402-6c2c-40fc-a970-a852b98b4ddf	6faa4818-6400-5edd-9816-77b5450e8ed6	2	Chuẩn bị hải sâm và vi cá	Bạn đun ấm nước khoảng 20 độ C cùng hành lá và gừng, cho 3 con hải sâm vào, bọc kín và để vào ngắn mát tủ lạnh, ngâm liên tục trong 3 ngày để hải sâm nở to. Miếng vi cá, bạn cũng ngâm trong nước, bọc kín và để trong tủ lạnh 4 ngày. Lưu ý: Nước ngâm hải sâm và vi cá phải sạch, không dính dầu mỡ để tránh nguyên liệu bị hỏng.	719	/culinary-blog/recipes/6faa4818-6400-5edd-9816-77b5450e8ed6/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6506bdf6-1b6f-4897-aaaf-017716cf3250	6faa4818-6400-5edd-9816-77b5450e8ed6	3	Xử lý sò điệp, nấm đông cô và giăm bông	Bạn lấy 100gr sò điệp khô đem ngâm trong nước ấm pha một ít rượu trắng trong 1 ngày. Với 100gr nấm đông cô khô, bạn ngâm trong nước ấm 1 đêm trước ngày nấu cho nở mềm. Đối với 200gr thịt giăm bông, bạn dùng dao cắt thành các lát mỏng vừa ăn.	479	/culinary-blog/recipes/6faa4818-6400-5edd-9816-77b5450e8ed6/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b16aec9d-42dd-461a-aefa-159102c6dbc6	6faa4818-6400-5edd-9816-77b5450e8ed6	4	Nấu nước dùng chuẩn vị	Bạn chuẩn bị một chiếc nồi lớn, cho vào 1 con gà và xương heo (gà và xương heo đã trụng nước sôi và rửa sạch). Tiếp tục thêm 20gr tiêu sọ trắng, 10gr trần bì và châm nước nóng vào cho ngập phần thịt gà và xương heo. Bạn hầm nồi nước dùng này liên tục trong 1 ngày 1 đêm ở lửa nhỏ để chắt lấy phần nước cốt tinh túy nhất. Mẹo nhỏ: Nếu không có nhiều thời gian, bạn có thể hầm nước dùng gà và nước dùng xương heo bằng nồi áp suất sẽ tiết kiệm thời gian hơn.	359	/culinary-blog/recipes/6faa4818-6400-5edd-9816-77b5450e8ed6/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9de09e15-24fc-4f8f-8938-796f55d16f7f	6faa4818-6400-5edd-9816-77b5450e8ed6	5	Xếp nguyên liệu vào thố sứ và chuẩn bị hấp	Bạn xếp tất cả các nguyên liệu gồm bào ngư, hải sâm, nấm, sò điệp, vi cá, giăm bông vào trong một chiếc âu sứ. Tiếp theo, bạn thêm vào một ít rượu trắng và đổ nước dùng gà vừa hầm vào cho ngập mặt.	287	/culinary-blog/recipes/6faa4818-6400-5edd-9816-77b5450e8ed6/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a326ec22-7c2e-47c5-a7aa-d805651b3497	4706ef19-ad91-4855-ac71-a904326e17e1	1	Sơ chế gà và gừng	Rửa sạch thịt gà và gừng thái lát	5	/culinary-blog/categories/mon-khai-vi.jpg	2026-11-20 10:31:08.302673+00	\N	f	\\xedf746dd0b94f248ac6c425e0446a187
c2a4b487-cf74-42c5-85cc-bb57cc0a5323	6faa4818-6400-5edd-9816-77b5450e8ed6	7	Thành phẩm	Món Phật nhảy tường hoàn thành có nước dùng ngọt thanh cùng màu vàng óng ả, mùi hương thơm lừng cả căn bếp. Bào ngư, vi cá và hải sâm chín mềm mại, hòa quyện cùng mùi thơm đặc trưng của nấm và trần bì tạo nên một món ăn có hương vị khó quên.	205	/culinary-blog/recipes/6faa4818-6400-5edd-9816-77b5450e8ed6/steps/7.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d1bb50e4-04de-40aa-8991-e805b300bdc5	e3438f8e-7aca-5d17-b956-236640ed480e	1	Sơ chế nguyên liệu	Bạn ngâm ốc với sả, ớt và nước vo gạo trong một buổi sáng cho sạch rồi rửa lại lần nữa. Cắt 300gr bồng khoai thành các khúc vừa ăn, phần đầu trên to thì chẻ làm đôi. Chẻ 1 quả cà chua thành các múi cau. Rau ngổ và mùi tàu đem cắt khúc. Hành khô (hành tím), tỏi và gừng bạn đem đập dập rồi băm nhỏ.	15	/culinary-blog/recipes/e3438f8e-7aca-5d17-b956-236640ed480e/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
66ecaf4b-65fa-4180-bec7-8e2581e8ca23	e3438f8e-7aca-5d17-b956-236640ed480e	2	Luộc và khêu thịt ốc	Đun sôi nồi nước với chút muối, giấm, gừng đập dập, sả cắt khúc và ớt sừng. Khi nước sôi, cho ốc vào luộc và đảo liên tục để ốc bung mài. Lưu ý vớt bọt trong quá trình luộc để nước dùng được trong. Sau khi nước sôi khoảng 3 - 5 phút, vớt ốc ra để nguội rồi dùng tăm khêu lấy phần ruột ốc béo ngậy.	7	/culinary-blog/recipes/e3438f8e-7aca-5d17-b956-236640ed480e/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
368cddc7-47a8-4644-9dee-c442f5389dc9	e3438f8e-7aca-5d17-b956-236640ed480e	3	Xào ruột ốc và ngó khoai	Bắc nồi lên bếp, phi thơm hành tỏi băm rồi cho phần ruột ốc vào xào sơ qua cho săn lại. Kế đến, bạn cho cà chua đã chẻ múi cau và 300gr bồng khoai vào xào chung, đảo đều tay để nguyên liệu thấm dầu và hương thơm của hành tỏi.	5	/culinary-blog/recipes/e3438f8e-7aca-5d17-b956-236640ed480e/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7fc9a03c-6092-4190-8c93-e3ff6cf37d87	e3438f8e-7aca-5d17-b956-236640ed480e	4	Nấu canh ốc với bồng khoai	Nêm vào nồi 1/3 muỗng canh bột nêm, 1 chút đường, 1/4 muỗng canh nước mắm và 1 vá nhỏ cơm mẻ. Để món ăn có màu đẹp, bạn có thể cho thêm bột nghệ (hoặc nghệ tươi giã lấy nước), mắm tôm và tiêu xay. Đảo đều cho gia vị thấm rồi cho nước luộc ốc vào. Đun sôi với lửa lớn, sau đó hạ nhỏ lửa và om trong khoảng 5 phút để ngó khoai chín mềm.	5	/culinary-blog/recipes/e3438f8e-7aca-5d17-b956-236640ed480e/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
94b0acbc-24ce-4c4d-a4ea-efd6c19be963	e3438f8e-7aca-5d17-b956-236640ed480e	5	Thành phẩm	Nêm nếm lại cho vừa ăn theo khẩu vị gia đình rồi cho rau ngổ, mùi tàu (có thể thêm tía tô, lá lốt nếu thích) cắt khúc vào, sau đó tắt bếp. Món ốc nấu bồng khoai là món ăn dân dã có màu vàng bắt mắt, nước dùng chua thanh vị mẻ, ruột ốc giòn sần sật kết hợp cùng ngó khoai mềm ngọt, thơm nồng mùi mắm tôm đặc trưng.	5	/culinary-blog/recipes/e3438f8e-7aca-5d17-b956-236640ed480e/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
01a283ad-ddd4-4de2-84e8-787d32ec34a7	2070da0c-204a-5f14-acfd-36c149358124	1	Sơ chế măng khô	Măng khô đem ngâm với nước trong khoảng 8 tiếng hoặc qua đêm để măng mềm hơn. Sau khi ngâm, dùng dao nhỏ tước măng thành những sợi thật nhỏ. Sợi măng càng nhỏ thì khi xào sẽ càng ngấm gia vị và ngấu hơn.	120	/culinary-blog/recipes/2070da0c-204a-5f14-acfd-36c149358124/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
19bbcbf5-40c8-4384-b08d-8cd439ff3e46	2070da0c-204a-5f14-acfd-36c149358124	2	Luộc măng loại bỏ độc tố	Đun sôi một nồi nước lớn, cho măng đã tước sợi vào luộc. Luộc măng khoảng 7 đến 8 lần. Mỗi lần luộc khoảng 5 phút. Sau mỗi lần luộc, vớt măng ra rổ và rửa sạch dưới vòi nước chảy để loại bỏ nước đục và chất độc. Lặp lại cho đến khi nước luộc măng thật trong.	60	/culinary-blog/recipes/2070da0c-204a-5f14-acfd-36c149358124/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f5122234-b97c-449e-8504-5e3a433e5b9e	2070da0c-204a-5f14-acfd-36c149358124	3	Sơ chế mực khô	Mực khô rửa sạch, sau đó ngâm với một chút rượu trắng và vài lát gừng để khử mùi tanh hôi. Sau khi ngâm, xé mực thành những sợi nhỏ vừa ăn.	40	/culinary-blog/recipes/2070da0c-204a-5f14-acfd-36c149358124/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
39410a88-de94-40cb-8a74-d1dee33f8f48	2070da0c-204a-5f14-acfd-36c149358124	4	Xào măng ngấm gia vị	Đặt chảo lên bếp, cho mỡ lợn vào đun nóng. Khi mỡ bắt đầu sôi lăn tăn, cho măng đã luộc sạch vào xào. Thỉnh thoảng, thêm một chút nước dùng gà vào để măng ngấu và hấp thụ hết vị ngọt của nước dùng. Nêm vào chảo 1 ít muối, 1 ít đường và 1 ít nước mắm. Đảo đều tay cho đến khi măng săn lại và ngấm đều gia vị.	30	/culinary-blog/recipes/2070da0c-204a-5f14-acfd-36c149358124/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bcb48be4-7c20-4faa-b023-80ca1cba4fe6	2070da0c-204a-5f14-acfd-36c149358124	5	Xào mực thơm lừng	Trong một chảo khác, tiếp tục cho mỡ lợn và mực đã xé sợi vào chảo xào. Đảo đều trên lửa vừa, tránh để lửa quá to làm mực bị cháy. Nêm thêm 1 ít muối, 1 ít đường và 1 ít nước dùng gà. Xào cho đến khi sợi mực mềm hơn, săn lại và dậy mùi thơm.	24	/culinary-blog/recipes/2070da0c-204a-5f14-acfd-36c149358124/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
76261f0f-4c30-4ae6-bc11-f3d55aab9228	2070da0c-204a-5f14-acfd-36c149358124	6	Xào chung và ninh canh măng mực	Cho măng đã xào vào chảo mực, đảo đều để măng và mực quyện vào nhau. Thêm một chút nước dùng gà nữa để các nguyên liệu hòa quyện. Tiếp tục xào cho đến khi sợi măng và mực săn lại, chuyển sang màu cánh gián đẹp mắt. Đây là khâu quan trọng để tạo độ ngấu và hương vị đặc trưng cho món ăn. Sau đó, đổ nước dùng gà vào chảo, đun sôi rồi hạ nhỏ lửa, ninh khoảng 45 phút cho măng và mực thật mềm, thấm vị.	20	/culinary-blog/recipes/2070da0c-204a-5f14-acfd-36c149358124/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f005e766-cc11-42ab-b6e5-437655155e6d	2070da0c-204a-5f14-acfd-36c149358124	7	Thành phẩm	Múc canh măng mực Bát Tràng ra bát. Món ăn này đặc biệt ở chỗ không cần thêm bất cứ loại rau gia vị nào để giữ trọn hương vị mộc mạc, thuần khiết nhất. Thưởng thức khi còn nóng.	17	/culinary-blog/recipes/2070da0c-204a-5f14-acfd-36c149358124/steps/7.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
dae32b9a-0055-49ab-8048-a1d738e4a791	afbf12f7-653a-5f1e-9a88-181afe8c6d76	1	Luộc và sơ chế trứng cút	Bạn cho 30 quả trứng cút vào nồi nước, bắc lên bếp luộc chín trong khoảng 5 phút. Sau khi trứng chín, bạn vớt ra cho vào bát nước lạnh để nguội bớt.	20	/culinary-blog/recipes/afbf12f7-653a-5f1e-9a88-181afe8c6d76/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4a063e11-1ece-4044-9ba4-c273ad134416	afbf12f7-653a-5f1e-9a88-181afe8c6d76	2	Xay thịt lợn xay	Bạn chuẩn bị 300gr thịt heo, rửa sạch và cắt nhỏ. Sau đó, bạn cho thịt vào máy xay và tiến hành xay cho đến khi thịt nhuyễn là được.	10	/culinary-blog/recipes/afbf12f7-653a-5f1e-9a88-181afe8c6d76/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
20dcb452-e8a9-4dee-a535-763853a42432	afbf12f7-653a-5f1e-9a88-181afe8c6d76	3	Pha nước sốt mặn ngọt	Bạn chuẩn bị một cái bát, cho vào các gia vị gồm: 100ml nước lọc, 4 muỗng canh nước mắm truyền thống, 3 muỗng canh đường, 2 muỗng canh tương ớt và 1 muỗng canh ớt bột. Bạn dùng muỗng khuấy thật đều để các gia vị hòa quyện vào nhau.	6	/culinary-blog/recipes/afbf12f7-653a-5f1e-9a88-181afe8c6d76/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5356ac41-f20d-4a9e-8e08-3453c0e26b81	afbf12f7-653a-5f1e-9a88-181afe8c6d76	4	Chiên trứng cút rim thịt băm	Bạn bắc chảo lên bếp với một ít dầu ăn, khi dầu nóng thì cho phần trứng cút đã lột vỏ vào. Bạn chiên trứng với lửa vừa, đảo nhẹ tay cho đến khi lớp vỏ ngoài của trứng vàng đều và săn lại thì vớt ra đĩa.	5	/culinary-blog/recipes/afbf12f7-653a-5f1e-9a88-181afe8c6d76/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cc82224a-8f44-41db-8ca7-f9c1b7a04322	afbf12f7-653a-5f1e-9a88-181afe8c6d76	5	Kho thịt băm rim trứng cút	Bạn sử dụng lại chảo đó, phi thơm tỏi và ớt băm. Tiếp theo, bạn cho thịt heo đã xay vào đảo đều tay cho đến khi thịt săn lại. Lúc này, bạn đổ phần nước sốt đã pha vào đun sôi, sau đó cho trứng cút đã chiên vào. Bạn đảo đều gia vị, kho cho đến khi nước sốt sệt lại, thấm đều vào trứng và thịt thì rắc thêm hành lá cắt nhỏ và ít hạt tiêu xay lên trên rồi tắt bếp.	5	/culinary-blog/recipes/afbf12f7-653a-5f1e-9a88-181afe8c6d76/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
787eef43-9bbc-4038-9e0e-a83b616e6e85	afbf12f7-653a-5f1e-9a88-181afe8c6d76	6	Thành phẩm	Món mặn ăn cơm này hoàn thành có màu sắc bắt mắt, trứng cút vàng ươm thấm vị cay mặn ngọt, thịt băm mềm béo hòa quyện cùng nước sốt đậm đà. Đây là món ngon mỗi ngày cực kỳ lý tưởng khi dùng kèm với cơm trắng nóng hổi.	5	/culinary-blog/recipes/afbf12f7-653a-5f1e-9a88-181afe8c6d76/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6a9deb61-1564-47a9-b77f-99fe013e6b22	96927fef-8c57-5362-8093-f3f0e230d69a	1	Sơ chế nguyên liệu	Bạn đem gừng và riềng miếng gọt sạch vỏ, rửa với nước rồi thái thành từng lát mỏng. Với khế chua, bạn rửa sạch, cắt bỏ phần rìa các cạnh và cuống, sau đó thái thành lát mỏng khoảng 1cm vừa ăn để món cá trắm nấu khế chua thêm phần đẹp mắt.	90	/culinary-blog/recipes/96927fef-8c57-5362-8093-f3f0e230d69a/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ecdd8822-c13f-4d0f-9a72-b63643f338e7	96927fef-8c57-5362-8093-f3f0e230d69a	2	Sơ chế và tẩm ướp cá	Bạn rửa sạch cá trắm và thịt ba chỉ với muối và giấm để khử mùi tanh cá hoàn toàn, sau đó xả lại nước sạch. Tiếp theo, bạn cho cá và thịt vào tô lớn, nêm vào 3 thìa nước mắm, 1 thìa hạt nêm, 1/2 thìa mì chính, 1.5 thìa đường, 1 thìa gia vị, 1 thìa hạt tiêu và 3 thìa nước hàng. Bạn dùng tay bóp nhẹ và trộn đều các gia vị kho cá, sau đó để cá ướp trong vòng 1 tiếng cho thấm đều.	45	/culinary-blog/recipes/96927fef-8c57-5362-8093-f3f0e230d69a/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
358f5eab-e2dd-47d3-982d-7dacc4d93a25	96927fef-8c57-5362-8093-f3f0e230d69a	3	Kho cá	Bạn chuẩn bị một chiếc nồi lớn, lần lượt xếp toàn bộ gừng và riềng miếng thái lát xuống dưới đáy nồi. Tiếp theo, bạn xếp một lớp khế chua lên trên. Cuối cùng, bạn lần lượt xếp thịt ba chỉ và các khúc cá trắm đã ướp vào nồi, sau đó đổ toàn bộ phần nước ướp cá còn dư trong tô lên phía trên cùng. Bạn đặt nồi lên bếp, cho thêm 2 quả ớt lên trên mặt cá, đậy vung và đun ở lửa to. Khi nước sôi, bạn chăm thêm nước nóng cho nước ngập xăm xắp mặt cá, đun cho nước sôi lại rồi hạ nhỏ lửa. Tiến hành kho cá với khế trong khoảng 1.5 tiếng để thịt cá chắc lại và thấm màu nâu cánh gián. Trong quá trình kho, nếu thấy nước quá cạn, bạn có thể cho thêm một ít nước nóng để cá chín mềm và không bị cháy đáy nồi.	30	/culinary-blog/recipes/96927fef-8c57-5362-8093-f3f0e230d69a/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
57431235-acd8-42c5-945a-1fc845a5c432	96927fef-8c57-5362-8093-f3f0e230d69a	4	Thành phẩm	Món cá trắm kho khế chua sau khi hoàn thành có màu nâu vàng óng ả bắt mắt. Miếng cá săn chắc, đậm đà quyện với vị béo ngậy của thịt ba chỉ và vị chua thanh đặc trưng của khế, ăn kèm với cơm trắng nóng hổi trong bữa cơm gia đình thì không gì bằng.	22	/culinary-blog/recipes/96927fef-8c57-5362-8093-f3f0e230d69a/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
34af3129-e8fd-4e82-93ae-dc870715d909	a6f8bcda-1250-5c08-bcbe-08addf0bf64d	1	Sơ chế cá và thịt ba chỉ	Cá diếc mua về bạn đánh vảy, mổ moi ruột và làm sạch. Bạn cho 10gr muối hạt vào cá, đảo đều và để ngấm trong khoảng 60 phút cho thịt cá cứng lại, lưu ý không rửa lại nước sau khi ướp. Thịt ba chỉ bạn rửa sạch, xắt miếng vừa ăn. Hành khô bóc vỏ bổ đôi, ớt bỏ núm để nguyên quả. Dưa cải muối chua bạn rửa sơ qua nước để giảm độ mặn.	240	/culinary-blog/recipes/a6f8bcda-1250-5c08-bcbe-08addf0bf64d/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
22b8d89c-a423-4f7d-8910-6371ba744ef8	a6f8bcda-1250-5c08-bcbe-08addf0bf64d	2	Pha hỗn hợp nước kho đậm đà	Bạn chuẩn bị một chiếc tô lớn, cho vào 800ml nước sôi và 200ml nước dưa chua. Sau đó, bạn nêm tiếp 1/2 thìa canh muối tinh, 1 thìa canh mì chính, 1 thìa canh hạt nêm, 1/2 thìa canh tiêu bột (nên dùng hạt tiêu Bắc cho thơm), 1 thìa canh đường, 5 thìa canh nước mắm truyền thống và khoảng 6 thìa nước hàng cốt dừa rồi khuấy đều.	120	/culinary-blog/recipes/a6f8bcda-1250-5c08-bcbe-08addf0bf64d/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b4c6f95f-75fe-4a1b-9507-e8d1896a397b	a6f8bcda-1250-5c08-bcbe-08addf0bf64d	3	Xếp nguyên liệu vào nồi	Bạn rải khoảng 300gr dưa chua xuống đáy nồi trước để tránh cháy cá, sau đó xếp một nửa số thịt ba chỉ lên trên. Tiếp đến, bạn xếp toàn bộ 1kg cá diếc đã ướp muối vào nồi. Sau cùng, bạn phủ nốt phần dưa chua, thịt ba chỉ còn lại cùng hành khô và ớt lên trên mặt cá. Nếu có củ riềng già, bạn có thể cắt lát lót dưới đáy nồi để tăng hương vị.	80	/culinary-blog/recipes/a6f8bcda-1250-5c08-bcbe-08addf0bf64d/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ba7f6e23-c6b5-4398-aaa6-b739a2ddfe47	a6f8bcda-1250-5c08-bcbe-08addf0bf64d	4	Kỹ thuật kho cá nhừ xương	Bạn đổ từ từ hỗn hợp nước kho đã pha vào nồi sao cho nước ngập mặt các nguyên liệu. Bạn đóng nắp nồi, đun sôi rồi hạ thật nhỏ lửa để cá sôi lăn tăn. Tiến hành kho cá từ 3 - 6 tiếng cho đến khi nước cạn hẳn và cá nhừ xương. Để món ăn ngon nhất, bạn nên kho hai lửa (đun cạn lần một, để nguội rồi kho tiếp) cho đến khi cá săn chắc và dưa mềm nhừ.	60	/culinary-blog/recipes/a6f8bcda-1250-5c08-bcbe-08addf0bf64d/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bc6ab888-bfbb-43f1-acf7-686a9d2bd830	4706ef19-ad91-4855-ac71-a904326e17e1	3	Hấp chín thịt gà	Hấp cách thủy 15 phút cho thịt chín ngọt	15	/culinary-blog/categories/mon-khai-vi.jpg	2026-11-20 10:31:08.302673+00	\N	f	\\x760ed389a4238143ad5522217b982f37
1c92b9db-a46a-4fc0-ba8b-cd04ec482de7	a6f8bcda-1250-5c08-bcbe-08addf0bf64d	5	Thành phẩm	Món cá nấu dưa chua miền Bắc đạt chuẩn khi cá vẫn nguyên con nhưng xương nhừ tan, thịt cá chắc thấm vị chua dịu của dưa và béo ngậy của mỡ lợn. Dưa chua thấm mỡ cá giòn ngon, màu nâu cánh gián bắt mắt, dậy mùi thơm của hành khô và tiêu. Đây sẽ là món ngon đưa cơm trong những ngày se lạnh mà bạn không thể bỏ qua.	48	/culinary-blog/recipes/a6f8bcda-1250-5c08-bcbe-08addf0bf64d/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2581caf6-5a1f-4855-ac08-0584f8cde2f3	c35b1123-1f4e-54ca-8d53-7bd26828403b	1	Sơ chế thịt heo	Thịt heo mua về bạn mang đi rửa thật sạch với hỗn hợp nước giấm và muối để khử sạch mùi hôi, sau đó để thịt thật ráo nước. Dùng dao cắt khối thịt thành những miếng dài và dày vừa phải để khi rim thịt nhanh chín hơn. Tiếp theo, bạn sử dụng một chiếc nĩa để châm đều lên khắp các bề mặt của miếng thịt. Công đoạn này giúp thịt nhanh ngấm nước sốt và khi hoàn thành sẽ mềm mại hơn.	50	/culinary-blog/recipes/c35b1123-1f4e-54ca-8d53-7bd26828403b/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
de2b3260-8746-4062-b341-21f87201a7fa	c35b1123-1f4e-54ca-8d53-7bd26828403b	2	Cách ướp thịt xá xíu đậm đà	Bạn chuẩn bị một chiếc tô lớn, cho vào 1 muỗng canh đường, 1 muỗng canh hạt nêm, 1/2 muỗng cà phê bột ngọt, 1 muỗng canh nước tương và 1 muỗng canh dầu hào. Tiếp tục thêm 1 muỗng canh rượu mai quế lộ, 1 muỗng cà phê bột màu điều tạo màu thực phẩm đỏ cam, 1/3 muỗng cà phê bột ngũ vị hương và hành tím, tỏi băm. Cuối cùng, bạn cho 2 gói gia vị vào trộn đều rồi cho thịt vào xoa bóp kỹ, để thịt nghỉ ít nhất 1 tiếng cho ngấm vị.	25	/culinary-blog/recipes/c35b1123-1f4e-54ca-8d53-7bd26828403b/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ce1d9aeb-bac2-4065-aa16-c33cbd9a01a2	c35b1123-1f4e-54ca-8d53-7bd26828403b	3	Rim thịt xá xíu bằng chảo	Bạn bắc chảo lên bếp, cho 2 muỗng canh dầu ăn vào phi thơm một ít tỏi băm rồi gắp các miếng thịt đã ướp vào áp chảo ở lửa nhỏ cho đến khi các mặt săn lại. Tiếp theo, bạn đổ toàn bộ phần nước ướp thịt còn sót lại vào chảo cùng 1 chén nước dừa tươi. Bạn rim thịt ở lửa nhỏ và thường xuyên trở đều các mặt cho đến khi nước sốt cạn dần, sánh sệt lại và tạo thành một lớp màng óng bao quanh miếng thịt thì tắt bếp.	16	/culinary-blog/recipes/c35b1123-1f4e-54ca-8d53-7bd26828403b/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0265f51f-3936-48fb-800a-0f8cc50d1390	c35b1123-1f4e-54ca-8d53-7bd26828403b	4	Thành phẩm	Đợi thịt nguội bớt rồi dùng dao cắt thành từng lát mỏng vừa ăn. Thịt xá xíu sau khi hoàn thành có màu sắc cực kỳ bắt mắt và bóng mượt, thớ thịt mềm mại không bị khô. Món ăn thấm đẫm vị mặn ngọt hài hòa, thơm nồng nàn mùi rượu mai quế lộ. Bạn có thể dùng món này để làm cơm xá xíu, bánh mì xá xíu hoặc ăn kèm hủ tiếu đều vô cùng chuẩn vị.	12	/culinary-blog/recipes/c35b1123-1f4e-54ca-8d53-7bd26828403b/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2dac88cb-67a1-446e-a432-b6a90c6ea25b	800e1933-2782-56a9-8745-01038b6a17a6	1	Sơ chế và ướp thịt bò	Thịt bò bạn thái miếng vừa ăn, ướp cùng 1/2 thìa cà phê bột nêm, 1/2 thìa cà phê đường, 1 thìa cà phê dầu hào và 1 thìa canh dầu ăn để thịt mềm mọng.	10	/culinary-blog/recipes/800e1933-2782-56a9-8745-01038b6a17a6/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f03c690f-abe4-4658-a9e6-89b29be116d1	800e1933-2782-56a9-8745-01038b6a17a6	2	Sơ chế đậu bắp và tỏi	Đậu bắp bạn rửa sạch, cắt bỏ cuống và cắt đôi. Tỏi và gừng bạn đập dập và băm nhuyễn.	5	/culinary-blog/recipes/800e1933-2782-56a9-8745-01038b6a17a6/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
64393a8d-7dc9-4422-891a-43ed25ddd95f	800e1933-2782-56a9-8745-01038b6a17a6	3	Xào thịt bò	Bạn phi thơm tỏi, gừng băm với dầu ăn, cho thịt bò vào xào ở lửa lớn. Đảo nhanh tay đến khi thịt vừa chuyển sang màu hồng nhạt thì tắt bếp, trút ra bát riêng để thịt không bị dai.	5	/culinary-blog/recipes/800e1933-2782-56a9-8745-01038b6a17a6/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
906038c7-33df-4de7-8525-ab824b23d9c2	800e1933-2782-56a9-8745-01038b6a17a6	4	Cách xào đậu bắp với thịt bò	Bạn phi thơm tỏi băm nhỏ, cho đậu bắp vào đảo đều ở lửa lớn. Cho thêm 1/3 bát con nước để đậu bắp chín nhanh, giữ màu xanh và độ giòn. Nêm nếm bột nêm, dầu hào cho vừa với khẩu vị gia đình. Khi đậu đã chín tới, cho thịt bò vào đảo nhanh rồi tắt bếp.	5	/culinary-blog/recipes/800e1933-2782-56a9-8745-01038b6a17a6/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
42cb509e-d6aa-4c4d-a0b1-5785cda01352	800e1933-2782-56a9-8745-01038b6a17a6	5	Thành phẩm	Trình bày món ăn ra đĩa, rắc thêm chút tiêu xay nếu thích. Đậu bắp xào thịt bò đạt chuẩn là khi đậu giữ được màu xanh mướt, độ giòn tự nhiên và thịt bò mềm ẩm, đậm đà hương vị.	5	/culinary-blog/recipes/800e1933-2782-56a9-8745-01038b6a17a6/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4f622297-d324-4a26-b5e6-6b5af45b1004	00e473bf-c28d-57bc-87b0-daeec99df819	1	Sơ chế nguyên liệu và băm thịt	Thái mỏng hành tím, sả và rau răm. Ớt sừng bỏ hạt, thái nhỏ. Chim bồ câu sau khi làm sạch, bạn lọc bỏ xương ống cứng, phần xương nhỏ còn lại giữ nguyên rồi băm thật nhuyễn để món ăn không bị lạo xạo.	15	/culinary-blog/recipes/00e473bf-c28d-57bc-87b0-daeec99df819/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4f699342-ab10-45d7-9dfb-84c7e4673f4b	00e473bf-c28d-57bc-87b0-daeec99df819	2	Xào chim câu xúc bánh đa	Phi thơm hành tím, sả băm với dầu ăn. Cho thịt chim đã xay vào xào săn. Khi thịt bắt đầu khô, nêm nếm nước mắm, dầu hào, hạt nêm, muối và một chút đường tuỳ khẩu vị gia đình. Lưu ý xào thật khô để khi ăn cùng bánh đa không bị ỉu. Mẹo nhỏ: Xào càng khô thì thịt chim càng thơm và giữ được độ giòn.	7	/culinary-blog/recipes/00e473bf-c28d-57bc-87b0-daeec99df819/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1f626428-36aa-4ef4-bd20-aa04bf24899b	00e473bf-c28d-57bc-87b0-daeec99df819	3	Hoàn thiện món ăn	Khi thịt chim đã khô và dậy mùi thơm, bạn cho ớt sừng và rau răm vào đảo đều rồi tắt bếp. Cho món ăn ra đĩa, ăn kèm bánh đa nướng giòn rụm và rau húng bạc hà để tăng thêm hương vị.	5	/culinary-blog/recipes/00e473bf-c28d-57bc-87b0-daeec99df819/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d5782d3e-9773-48d0-93c0-834a63b40e06	00e473bf-c28d-57bc-87b0-daeec99df819	4	Thành phẩm	Món chim bồ câu xúc bánh đa có màu sắc bắt mắt, thịt chim giòn thơm, đậm đà, không hề bị tanh. Đây là món nhậu hoặc món ăn chơi cực kỳ cuốn hút.	5	/culinary-blog/recipes/00e473bf-c28d-57bc-87b0-daeec99df819/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a26d42db-f6ef-4477-944c-0c5e26e5b93a	65176e6d-dd1e-5109-87e3-044085e7a102	1	Sơ chế thịt bò	Bạn lấy dao cắt lọc đi phần thịt mỡ còn dư của thịt bò sau đó cắt thịt thành các miếng vuông vừa ăn khoảng 1.5 lóng tay cho vào tô lớn.	12	/culinary-blog/recipes/65176e6d-dd1e-5109-87e3-044085e7a102/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1686bef5-d73e-4d94-97c2-bab80c1d3a41	65176e6d-dd1e-5109-87e3-044085e7a102	2	Nghiền và ướp gia vị bò	Bạn lấy sả cắt phần đầu cho vào máy xay, xay nhuyễn rồi cho vào tô ướp thịt bò. Với hành tím, tỏi, gừng và ớt bạn cũng xay nhuyễn và lấy 3/4 cho vào tô ướp. Phần còn lại bạn múc ra chén. Tiếp đến, bạn cho vào tô ướp thịt 2 muỗng canh sa tế tôm cay, 1 muỗng canh xì dầu, 1 muỗng canh nước mắm, 2 muỗng canh rượu Thiệu Hưng, 2 muỗng canh dầu điều, 1 muỗng canh đường nâu và 1 muỗng canh tiêu bột. Cuối cùng, chúng ta trộn đều lên và đợi 30 phút cho thịt thấm đều gia vị.	6	/culinary-blog/recipes/65176e6d-dd1e-5109-87e3-044085e7a102/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2784695d-503b-4f30-820b-396c89494cd5	65176e6d-dd1e-5109-87e3-044085e7a102	3	Cắt hành củ và xiên que	Bạn lột vỏ hành tây, cắt hành tây thành các miếng vuông vừa ăn bằng với kích thước của thịt bò đang ướp khoảng 1.2 lóng tay. Sau đó bạn đeo găng tay vào và lấy 1 que xiên, xiên thịt và hành xen kẽ nhau theo tỷ lệ 1 thịt, 1 hành. Làm tương tự với những que khác cho đến khi hết thịt.	5	/culinary-blog/recipes/65176e6d-dd1e-5109-87e3-044085e7a102/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
022d83ea-b52b-4c6c-8970-23a7bd0b3225	65176e6d-dd1e-5109-87e3-044085e7a102	4	Nướng bò lúc lắc	Ta lấy kẹp thức ăn gắp từng que xiên vào nồi chiên không dầu sau đó chọn chế độ nướng trong 12 phút ở nhiệt độ 180°C.	5	/culinary-blog/recipes/65176e6d-dd1e-5109-87e3-044085e7a102/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
006a36ff-2434-40c1-89a4-a8d5a921cdca	65176e6d-dd1e-5109-87e3-044085e7a102	5	Làm nước chao chấm	Đầu tiên, bạn lần lượt cho vào máy xay 3 muỗng canh chao, 3 muỗng canh sữa đặc, 1 muỗng canh dầu điều, 2 muỗng canh vừng trắng rang vàng, 1 muỗng canh dầu điều, 3 muỗng canh nước lọc và 3 muỗng canh hỗn hợp hành tỏi gừng ớt đã xay nhuyễn. Sau đó đậy nắp lại và xay nhuyễn cho đến khi các gia vị hòa quyện vào nhau. Cuối cùng bạn múc nước chấm chao ra chén và thưởng thức cùng với thịt bò lúc lắc nướng sa tế thơm ngon.	5	/culinary-blog/recipes/65176e6d-dd1e-5109-87e3-044085e7a102/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bbedda46-6318-4787-b401-68715ecd63ce	65176e6d-dd1e-5109-87e3-044085e7a102	6	Thành phẩm	Món bò lúc lắc nướng sa tế sau khi nướng xong sẽ có hương thơm đặc trưng của thịt nướng. Khi ăn cùng với nước chấm chao sẽ có vị đậm đà, ngon ngọt và hấp dẫn. Rất thích hợp để ăn cùng bạn bè hoặc gia đình vào cuối tuần phải không nào?	5	/culinary-blog/recipes/65176e6d-dd1e-5109-87e3-044085e7a102/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
32d821a6-5ebb-4ded-b733-890ac555c04b	af6c8fb3-5c98-555c-88cd-531a8c513312	1	Sơ chế nguyên liệu	Thịt heo rừng mua về bạn dùng dao cạo sạch lông, rửa với nước muối loãng để khử mùi hôi thịt rừng hiệu quả. Bạn có thể thui sơ qua phần da để khử mùi. Sau đó, bạn rửa lại thịt heo bằng nước sạch, để ráo và cắt thành những miếng mỏng vừa ăn khoảng 0.5cm. Sả bào mỏng, băm nhuyễn cùng với tỏi, và hành tím.	25	/culinary-blog/recipes/af6c8fb3-5c98-555c-88cd-531a8c513312/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
056f0860-15b4-473f-82d5-4f4be603cb4a	af6c8fb3-5c98-555c-88cd-531a8c513312	2	Ướp thịt heo rừng	Cho thịt vào tô lớn, thêm vào 1 phần sả băm, tỏi băm và hành tím băm. Tiếp tục cho 3 muỗng canh dầu hào, 2 muỗng cà phê bột nêm, 1/2 muỗng canh đường (tùy chọn) và 2 muỗng canh ớt sa tế vào trộn đều. Bạn để thịt ngấm gia vị trong khoảng 15 - 20 phút.	12	/culinary-blog/recipes/af6c8fb3-5c98-555c-88cd-531a8c513312/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d78cdc54-f668-4acf-9741-831fd9d92e18	af6c8fb3-5c98-555c-88cd-531a8c513312	3	Xào thịt heo rừng	Bạn đặt chảo lên bếp và bật lửa, cho 1 muỗng canh dầu ăn và một ít dầu màu điều vào đun nóng. Khi dầu đã nóng, bạn cho phần sả băm và tỏi băm vào phi. Bạn dùng đũa đảo đều tay cho đến khi ngửi thấy mùi sả và tỏi tỏa hương thơm lừng. Khi các nguyên liệu vàng thơm, bạn đổ toàn bộ thịt heo rừng đã ướp vào xào ở lửa lớn. Đảo nhanh tay cho đến khi thịt săn lại và dậy mùi thơm. Cuối cùng, khi thịt đã chín, bạn nêm thêm 1 muỗng cà phê nước mắm vào, đảo nhanh tay cho thịt đậm đà rồi tắt bếp.	8	/culinary-blog/recipes/af6c8fb3-5c98-555c-88cd-531a8c513312/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
24c9bae6-57dd-444f-93d7-2dc27df1779b	af6c8fb3-5c98-555c-88cd-531a8c513312	4	Thành phẩm	Món thịt heo rừng xào sa tế hoàn thành có màu sắc bắt mắt, thơm nồng mùi sả và tỏi. Khi ăn, bạn sẽ cảm nhận được độ giòn của da heo, thịt mềm thấm vị cay cay của sa tế. Món này dùng kèm cơm nóng hoặc xúc bánh đa, thêm chút rau răm thì ngon tuyệt hảo.	6	/culinary-blog/recipes/af6c8fb3-5c98-555c-88cd-531a8c513312/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f0d242c9-02a0-4107-b708-f021feff51a7	0d671484-83b8-53a4-9d47-f04c612bea06	1	Sơ chế cánh gà	Cánh gà bạn rửa qua với nước. Tiếp đến bạn dùng muối chà xát cánh gà để làm sạch cặn bẩn, váng mỡ. Sau đó rửa lại với nước sạch, để ráo. Tiếp đó dùng mũi nhọn của dao đâm nhẹ quanh bề mặt cánh gà để khi ướp gia vị được thấm hơn.	30	/culinary-blog/recipes/0d671484-83b8-53a4-9d47-f04c612bea06/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
22b78c4c-3758-4f8d-a48d-ad3e70189b82	0d671484-83b8-53a4-9d47-f04c612bea06	2	Sơ chế các nguyên liệu khác	Hành tím, tỏi bóc vỏ để nguyên củ. Gừng rửa sạch, cạo vỏ, cắt lát. Ớt rửa sạch để ráo. Rau húng lủi, lặt lá, rửa sạch, để ráo. Dưa leo rửa sạch, cắt lát. Để làm muối ớt xanh làm gia vị chấm cánh gà nướng, bạn cho vào cối 2 trái ớt đỏ, 5 trái ớt xanh, 2 muỗng cà phê muối, 1 muỗng cà phê bột ngọt, 1 ít rau húng lủi rồi dùng chày giã nhuyễn hỗn hợp.	15	/culinary-blog/recipes/0d671484-83b8-53a4-9d47-f04c612bea06/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7de70803-d26d-42ad-9306-ef13a44f8f2e	0d671484-83b8-53a4-9d47-f04c612bea06	3	Xay hỗn hợp ướp	Cho vào cối xay 3 trái ớt, gừng cắt lát, 3 củ hành tím, 4 tép tỏi, 1 muỗng cà phê muối, 2 muỗng canh dầu ăn, 1 muỗng canh nước mắm, 2 muỗng cà phê bột ớt. Thêm 2 muỗng canh sữa tươi không đường, 1 muỗng canh tương ớt, 2 muỗng canh mật ong, 1 muỗng cà phê bột nghệ. Sau đó, xay nhuyễn hỗn hợp, tiếp đến bạn rây qua hỗn hợp lọc bỏ phần xác, lấy phần nước dùng để ướp cánh gà.	10	/culinary-blog/recipes/0d671484-83b8-53a4-9d47-f04c612bea06/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
549e60b8-8ae0-442d-bc84-391a71a46438	0d671484-83b8-53a4-9d47-f04c612bea06	4	Ướp cánh gà	Cho cánh gà cho vào tô lớn, trộn đều với 2 muỗng canh hỗn hợp ướp rồi để cánh gà ướp khoảng 1 giờ cho cánh gà ngấm gia vị. Sau đó, bạn dùng xiên tre, xiên cánh gà để khi nướng việc trở cánh gà được dễ hơn.	7	/culinary-blog/recipes/0d671484-83b8-53a4-9d47-f04c612bea06/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1ae146de-6813-4492-b893-23d47612624d	0d671484-83b8-53a4-9d47-f04c612bea06	5	Nướng gà	Để lò ổn định nhiệt độ, bạn làm nóng lò nướng trước 10 phút ở 180 độ C . Xếp cánh gà lên khay, cho vào lò nướng trong vòng 20 phút ở nhiệt độ 180 độ C. Sau 20 phút bạn mở lò, lấy cánh gà ra, dùng cọ phết đều 1 lớp hỗn hợp ướp lên cánh gà rồi tiếp tục nướng cánh gà ở 220 độ C thêm 10 phút nữa là hoàn tất.	6	/culinary-blog/recipes/0d671484-83b8-53a4-9d47-f04c612bea06/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
16c82042-1cdf-49b5-baab-dc5022683e30	0d671484-83b8-53a4-9d47-f04c612bea06	6	Thành phẩm	Cánh gà nướng vàng ươm, thơm phức có lớp da giòn giòn, thịt gà mềm thấm vị cay cay mặn mặn vừa ăn. Bạn ăn kèm cánh gà nướng với dưa leo, rau húng lủi chấm thêm ít muối ớt xanh ngon hết ý.	5	/culinary-blog/recipes/0d671484-83b8-53a4-9d47-f04c612bea06/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5b82d4ae-aab2-46a7-bd6b-10b028368178	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	1	Pha hỗn hợp ướp nọng heo nướng	Đầu tiên, bạn cho hành khô và tỏi vào máy xay nhuyễn. Tiếp theo, thêm vào hỗn hợp 1.5 thìa hạt nêm, 1 thìa bột ngọt, 2 thìa nước mắm, 1.5 muỗng dầu hào, 1 thìa sa tế, một chút tiêu, 2 thìa sữa đặc để tạo độ ngọt và giúp thịt không bị cháy. Cuối cùng, thêm ngũ vị hương, một chút nước và dầu ăn rồi xay đều tất cả thành hỗn hợp sệt.	60	/culinary-blog/recipes/fe9e5b13-de22-5cc0-b1e0-be1faf53d158/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2e44f85b-8445-4237-88ff-e065e08bdb37	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	2	Ướp thịt nọng heo nướng	Cho toàn bộ hỗn hợp gia vị vừa xay vào ướp cùng miếng nọng heo. Bạn nên để nguyên miếng lớn khi nướng để thịt giữ được độ mọng nước, không bị khô. Dùng màng bọc thực phẩm bao kín tô thịt, cho vào ngăn mát tủ lạnh và ướp trong khoảng 1.5 đến 2 tiếng cho gia vị thấm đều vào từng thớ thịt.	30	/culinary-blog/recipes/fe9e5b13-de22-5cc0-b1e0-be1faf53d158/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9bc2583c-da37-465d-8247-b69a13bf8e3f	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	3	Áp chảo và nướng thịt	Bắc chảo lên bếp, đợi chảo nóng già thì cho một chút dầu ăn vào. Cho miếng thịt nọng đã ướp vào áp chảo cho đến khi các cạnh xém vàng và dậy mùi thơm đặc trưng của ngũ vị hương. Sau đó, bạn chuyển thịt vào nồi chiên không dầu ở nhiệt độ 180 độ C trong khoảng 7 phút.	20	/culinary-blog/recipes/fe9e5b13-de22-5cc0-b1e0-be1faf53d158/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0ad9f826-dfc9-4c8f-a9c7-479d5a540461	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	4	Thành phẩm	Thái thịt nọng heo nướng thành những miếng mỏng vừa ăn, bạn có thể dùng kèm dưa góp để tăng thêm hương vị. Miếng thịt có màu vàng óng đẹp mắt, khi ăn cảm nhận rõ độ giòn sần sật, vị ngọt từ sữa đặc và hương thơm nồng nàn của ngũ vị hương mà không hề gây cảm giác ngấy.	15	/culinary-blog/recipes/fe9e5b13-de22-5cc0-b1e0-be1faf53d158/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5c98aa04-af8d-4546-bbb8-5a0611511dc0	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	5	Ướp nọng heo	Nọng heo sau khi rửa sạch thì mang đi ướp với chao và các gia vị đã chuẩn bị sẵn. Ướp nọng heo từ 3 - 4 tiếng để gia vị thấm hoàn toàn.	12	/culinary-blog/recipes/fe9e5b13-de22-5cc0-b1e0-be1faf53d158/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f5de02ea-1bc5-4506-a7c0-164fe2207036	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	6	Nướng nọng heo	Mang nọng heo đi nướng trong nồi chiên không dầu. Lần 1, bạn nướng nọng heo với nhiệt độ 170 trong 15 phút. Lần 2, bạn trở mặt thịt và nướng với nhiệt độ 180 trong 5 phút nữa.	10	/culinary-blog/recipes/fe9e5b13-de22-5cc0-b1e0-be1faf53d158/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e2bbae6c-59d3-459a-b0af-7e9f692218e6	fe9e5b13-de22-5cc0-b1e0-be1faf53d158	7	Thành quả và thưởng thức	Nạc nọng heo sau khi nướng xong thì mang ra cắt thành những lát mỏng vừa ăn. Món này ngon nhất là khi được cuốn trong rau xà lách và chấm chao.	8	/culinary-blog/recipes/fe9e5b13-de22-5cc0-b1e0-be1faf53d158/steps/7.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e096e2aa-fc2e-448f-8c61-b0892cc7d021	fca4c223-74d8-5132-af27-fbb11c02ebe9	1	Sơ chế thảo mộc	Rang thơm các nguyên liệu gồm quế, hạt ngò, tiểu hồi, đinh hương, hoa hồi, thảo quả và vỏ quýt khô. Sau đó đem xay sơ rồi trộn cùng 1/4 muỗng cà phê bột ngũ vị hương.	240	/culinary-blog/recipes/fca4c223-74d8-5132-af27-fbb11c02ebe9/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
848891d0-72d3-4896-b2cc-342ab20d239f	fca4c223-74d8-5132-af27-fbb11c02ebe9	2	Ngâm trứng cút với thảo mộc	Pha hỗn hợp thảo mộc với 1,5 lít nước và 1,5 muỗng cà phê muối. Cho trứng cút đã rửa sạch vào ngâm trong 1,5 tiếng để thấm vị.	120	/culinary-blog/recipes/fca4c223-74d8-5132-af27-fbb11c02ebe9/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
577a0d33-b2f0-49d6-9894-f49b6105030f	fca4c223-74d8-5132-af27-fbb11c02ebe9	3	Luộc và ủ trứng cút	Vớt trứng cút vào nồi, thêm nước thảo mộc vừa đủ ngập trứng. Luộc 10 phút, tắt bếp ủ 1 tiếng. Tiếp tục luộc lần hai 10 phút rồi ủ thêm 2 tiếng để trứng thơm đậm đà. Mẹo nhỏ: Nếu bạn muốn thành phẩm trứng cút có màu vàng đậm đà, hãy ngâm trứng thêm 1-2 tiếng. Tránh ngâm quá lâu sẽ làm trứng mặn và nồng mùi thảo mộc.	80	/culinary-blog/recipes/fca4c223-74d8-5132-af27-fbb11c02ebe9/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a4a3a1bb-82fb-40cf-8713-098250d831ec	fca4c223-74d8-5132-af27-fbb11c02ebe9	4	Chuẩn bị muối ủ	Trộn 2kg muối với một ít nước và 2 lòng trắng trứng gà cho đến khi hỗn hợp có độ kết dính tốt, nắm lại không bị rời rạc.	60	/culinary-blog/recipes/fca4c223-74d8-5132-af27-fbb11c02ebe9/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d9d74042-ad53-43da-b7c9-a97e34c802ec	fca4c223-74d8-5132-af27-fbb11c02ebe9	5	Tạo hình và nướng trứng	Lót vải lên vỉ hấp, rải một lớp muối, xếp trứng vào rồi rắc đều 1 muỗng cà phê ngũ vị hương trên trứng, cuối cùng đắp thêm muối lên trên. Đun sôi nồi nước bên dưới để hơi nóng làm cứng lớp muối bao quanh trứng.	48	/culinary-blog/recipes/fca4c223-74d8-5132-af27-fbb11c02ebe9/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2f16acb0-21ef-4fe3-a060-77d7edc7e4f7	fca4c223-74d8-5132-af27-fbb11c02ebe9	6	Thành phẩm	Trứng cút nướng muối Trung Hoa có lớp vỏ muối cứng cáp, bên trong trứng thấm vị thảo mộc thơm lừng, béo ngậy mà không hề bị mặn.	40	/culinary-blog/recipes/fca4c223-74d8-5132-af27-fbb11c02ebe9/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
49e975b8-4745-4d05-9c22-6feffc4256d8	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	1	Sơ chế vịt sạch sẽ	Đầu tiên, vịt sau khi rã đông hoàn toàn (nếu là vịt đông đá), bạn hãy rửa sạch ngay dưới vòi nước mát và để vịt thật ráo nước. Lưu ý, da vịt bị trầy xước sẽ không giòn nên đừng chà xát mạnh hay dùng gừng, giấm, rượu để chà lên da vịt nhé.	60	/culinary-blog/recipes/5cd6107b-08cb-5205-b4a5-e5b055f39e2f/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
434a7588-b342-4608-9376-a90a591db7a5	9cf5ba46-1b6e-4925-991c-8f2ed99ecf47	3	Hấp chín và thưởng thức	Hấp cách thủy trong 20 phút cho gà chín tới, rắc lá chanh lên trên.	20	/culinary-blog/categories/mon-khai-vi.jpg	2026-11-20 10:40:31.503473+00	\N	f	\\x2f8274cce9008c4f8eb597afe0f3e50c
4865231a-d084-4d1f-ab6e-52250d96b300	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	2	Pha muối ướp vịt đậm đà	Trong một tô lớn, bạn cho 6 gr muối, 20 gr đường, 10 gr bột ngọt, 2 gr bột sa cương (nếu không có có thể thay bằng ngũ vị hương) + 1 gr ngũ vị hương, 2 gr bột tiêu xanh. Bạn cho 6 gr tiêu đen nguyên hạt vào cối giã dập hoặc xay sơ, đừng xay quá nhuyễn để giữ được mùi thơm nồng. Bóp nhỏ 3 lá nguyệt quế rồi cho tất cả vào tô gia vị, trộn đều.	30	/culinary-blog/recipes/5cd6107b-08cb-5205-b4a5-e5b055f39e2f/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
122998bf-cdda-49f5-8cfe-f3f38120c2d0	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	3	Ướp vịt và ghim kín phần cổ	Khi vịt ráo, bạn cho toàn bộ hỗn hợp muối ướp vào trong bụng vịt và đều khắp các phần thịt bên trong: hai bên đùi, ức, lưng... để gia vị thấm sâu. Sau đó, xếp gọn phần da cổ vịt và dùng que tre xiên thịt ghim kín lại. Việc này giúp vịt phồng lên tự nhiên khi nướng mà không cần bơm hơi. Để vịt nghỉ từ 30 đến 60 phút cho thấm gia vị.	20	/culinary-blog/recipes/5cd6107b-08cb-5205-b4a5-e5b055f39e2f/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1cd39ce0-244b-4529-a74e-f78d17db838e	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	4	Pha tương vịt chuẩn vị Ma Cao	Để pha tương vịt chuẩn vị Ma Cao, bạn cho 8 gr chao đỏ, 20 gr tương hoisin, 10 gr dầu hào, 20 gr tương trụ hầu (có thể thay bằng sốt xá xíu nhưng giảm đường vì tương xá xíu ngọt hơn). Đánh đều cho chao tan hết. Giã hoặc nghiền hơi nhuyễn 1 gr mè rang vàng cho vào hỗn hợp tương. Cuối cùng, thêm 1 muỗng cà phê rượu trắng (rượu sakê hoặc rượu nấu ăn đều được) và khuấy đều.	15	/culinary-blog/recipes/5cd6107b-08cb-5205-b4a5-e5b055f39e2f/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
82689ba3-32ce-48e3-b964-bd23cb84db25	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	5	Nhồi tương và may kín bụng vịt	Khi vịt ướp đủ thời gian, bạn dùng cây vét bột hoặc muỗng để trải đều tương vịt đã pha khắp bên trong bụng vịt. Nếu thích, bạn có thể nhồi thêm nấm mèo và hoa kim châm đã ngâm mềm vào bụng vịt cùng tương. Sau đó, dùng kim và chỉ nấu ăn để may kín phần bụng vịt và phần da vịt bị rách nếu có. Cắt bỏ phần đầu cánh vịt, chỉ chừa lại đoạn trên của cánh.	12	/culinary-blog/recipes/5cd6107b-08cb-5205-b4a5-e5b055f39e2f/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
97840522-6e57-4073-a936-a06aba7d57c2	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	6	Chần nước sôi và phết giấm cho vịt quay da giòn	Bạn nấu sẵn 1 lít nước sôi. Cầm vịt lên (có thể dùng móc nếu có) từ từ dội nước sôi khắp da vịt từ cổ xuống ức và lưng để da vịt săn lại. Tiếp theo, pha hỗn hợp giấm để phết lên da vịt gồm 40 gr mạch nha, 60 gr giấm trắng, 5 gr giấm đỏ và 2 gr muối nở. Thoa đều hỗn hợp giấm lên khắp da vịt. Hỗn hợp giấm này là bí quyết giúp da vịt lên màu tự nhiên và giòn tan khi nướng.	10	/culinary-blog/recipes/5cd6107b-08cb-5205-b4a5-e5b055f39e2f/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cd1aa12b-edff-44e7-a1ea-ab2983a318f1	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	7	Sấy khô vịt - Bí quyết vịt quay tiêu da giòn rụm	Và bí quyết cực kỳ quan trọng để món vịt quay tiêu có da giòn rụm. Bạn nên dùng quạt thổi trực tiếp vào vịt liên tục trong khoảng 1 ngày (24 tiếng) cho da vịt khô hoàn toàn. Da vịt càng khô thì khi nướng càng giòn và lên màu càng đẹp.	8	/culinary-blog/recipes/5cd6107b-08cb-5205-b4a5-e5b055f39e2f/steps/7.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
97f49ccd-5464-4ffd-8447-fc6edbf4df91	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	8	Nướng vịt quay tiêu thơm lừng	Làm nóng lò nướng ở nhiệt độ 120°C (248°F) với chế độ quạt trong 10 phút. Đặt vịt ở rãnh giữa lò, cách thanh nhiệt khoảng một gang tay. Sau 10 phút, tăng nhiệt độ lên 180°C (356°F) vẫn giữ chế độ quạt, với vịt 1.8kg, bạn có thể nướng khoảng 35-40 phút, vịt 2.4-2.5kg thì nướng 50 phút. Nếu lò không có quạt, bạn bật 200°C và trở vịt để vàng đều. Mẹo nhỏ: Nếu bạn muốn lấy nước sốt trong bụng vịt để chấm, hãy để vịt nghỉ khoảng 10 phút sau khi nướng rồi rút kim may ra. Nếu để lâu hơn, nước sốt sẽ thấm ngược vào thịt.	7	/culinary-blog/recipes/5cd6107b-08cb-5205-b4a5-e5b055f39e2f/steps/8.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1d44af6f-8e67-46f8-9e7f-65c2e95afbcc	5cd6107b-08cb-5205-b4a5-e5b055f39e2f	9	Thành phẩm	Vịt quay tiêu sau khi nướng sẽ có lớp da vàng óng, giòn rụm và thịt chín mềm, ngọt đậm đà. Bạn có thể cắt vịt thành từng miếng vừa ăn và thưởng thức cùng cơm, bánh mì hoặc kẹp vào bánh bao đều rất ngon. Món vịt nướng tiêu này có vị ngọt đậm đà và cay nhẹ đặc trưng, đảm bảo sẽ làm hài lòng cả những thực khách khó tính nhất!	6	/culinary-blog/recipes/5cd6107b-08cb-5205-b4a5-e5b055f39e2f/steps/9.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0578e7ae-1983-4640-aa89-083a99f81019	a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	1	Sơ chế nguyên liệu	Đầu tiên, bạn chẻ đôi 2 trái ớt, loại bỏ sạch hạt bên trong rồi băm thật nhuyễn. Với 225gr tôm tươi đã làm sạch, bạn chia thành 2 phần, 1 phần thì cắt miếng nhỏ, phần còn lại dùng dao băm hoặc cho vào máy xay thịt chuyên dụng xay nhuyễn mịn.	15	/culinary-blog/recipes/a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cd87e2cb-6b9f-4d39-b6b1-fadcbefa60d5	a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	2	Ướp gia vị đậm đà cho cách làm chả tôm thịt trứng	Bạn chuẩn bị một chiếc tô lớn, cho 450gr thịt heo xay (thịt nạc vai), phần tôm đã xay mịn và ớt băm vào. Tiếp theo, bạn cho vào các gia vị bao gồm: 2 muỗng cà phê hạt nêm, 2 muỗng cà phê đường, 1/2 muỗng cà phê muối, 1 muỗng cà phê hạt tiêu trắng và 1/2 muỗng canh nước mắm ngon để tăng thêm hương vị đậm đà. Cuối cùng, bạn đập thêm 2 quả trứng gà, cho 1 muỗng canh tỏi băm, 1 muỗng canh hành lá và 2 muỗng canh bột năng vào hỗn hợp. Nếu thực hiện cách làm chả tôm cho bé, bạn có thể gia giảm ớt và sử dụng gia vị ăn dặm phù hợp. Bạn dùng tay đeo bao nilon hoặc muỗng trộn thật kỹ để tất cả nguyên liệu hòa quyện và thấm đều gia vị. Sau khi trộn đều, bạn nên cho hỗn hợp vào ngăn mát tủ lạnh nghỉ khoảng 15 phút.	7	/culinary-blog/recipes/a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b4590edf-202e-4c08-bde7-d4c2beadbf34	a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	3	Chiên chả vàng giòn hoặc hấp cách thủy	Bạn bắt chảo lên bếp, cho 100ml dầu ăn vào đun ở lửa lớn. Khi dầu đã nóng già, bạn múc từng muỗng hỗn hợp thịt cho vào chảo, dùng muỗng ép nhẹ để miếng chả có hình tròn dẹt vừa ăn. Bạn tiến hành chiên ở lửa lớn, lật đều hai mặt cho đến khi chả chín vàng ruộm, tỏa mùi thơm nức và có lớp vỏ ngoài giòn tan thì vớt ra để ráo dầu.	5	/culinary-blog/recipes/a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
47e012c1-4dc9-45ba-9a38-2b06b2c14021	a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	4	Thành phẩm	Những miếng chả tôm thịt nóng hổi, màu vàng nâu cực kỳ đẹp mắt. Khi ăn, bạn sẽ cảm nhận được lớp vỏ giòn tan, nhân bên trong ngọt thanh, mọng nước và đậm đà gia vị. Chả ngon nhất khi ăn nóng cùng cơm trắng, dưa leo và nước tương tỏi ớt.	5	/culinary-blog/recipes/a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
350c876d-ac63-49ad-8820-0f7756daebf6	0328808d-a3ff-572c-9a61-fc373949e163	1	Sơ chế và ướp thịt ba chỉ	Thịt ba chỉ sau khi mua về bạn đem rửa sạch với nước muối loãng, sau đó dùng giấy thấm thật khô rồi cắt thành những miếng vuông vừa ăn có kích thước khoảng 1cm. Bạn cho 900gr thịt vào tô lớn, đổ 60gr đường vào và trộn thật đều để đường ngấm vào từng thớ thịt. Việc ướp đường trước giúp mỡ thịt trong hơn và thịt có màu đẹp hơn khi chế biến.	20	/culinary-blog/recipes/0328808d-a3ff-572c-9a61-fc373949e163/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
97c73a8c-55ac-48d2-bfa0-647896af8141	0328808d-a3ff-572c-9a61-fc373949e163	2	Sơ chế các nguyên liệu khác	Bạn thái lát 5 nhánh sả rồi cho vào máy xay sinh tố xay nhuyễn, để riêng. Sau đó, bạn tiếp tục cho 30gr hành tím và 30gr tỏi vào máy xay thật nhuyễn. Với phần sả đã xay, bạn lấy khoảng 2/3 cho vào bát, cho thêm một chút nước rồi cho vào túi vải vắt lấy nước cốt sả nguyên chất.	10	/culinary-blog/recipes/0328808d-a3ff-572c-9a61-fc373949e163/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
000de8cd-413e-4f65-b155-c27f43be2ba4	0328808d-a3ff-572c-9a61-fc373949e163	3	Cách rang thịt ba chỉ với mắm tép cháy cạnh	Bạn bắc chảo lên bếp, cho 2 thìa canh dầu ăn và 1 thìa canh dầu màu điều vào đun nóng. Khi dầu đã nóng, bạn trút toàn bộ phần thịt ba chỉ đã ướp đường vào rang. Bạn đảo đều tay ở lửa vừa cho đến khi thịt bắt đầu săn lại và tiết ra mỡ. Lúc này, bạn đổ phần nước cốt sả đã vắt vào chảo thịt, tiếp tục rang cho đến khi nước cốt sả cạn dần và miếng thịt bắt đầu vàng giòn, cháy cạnh đẹp mắt.	6	/culinary-blog/recipes/0328808d-a3ff-572c-9a61-fc373949e163/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
49c51e46-5c24-46e4-b22c-9d3ad4e8a8d6	0328808d-a3ff-572c-9a61-fc373949e163	4	Hoàn thành món ăn	Khi thịt đã vàng, bạn cho nốt phần hành, tỏi và xác sả đã xay nhuyễn vào phi thơm cùng với thịt. Tiếp đến, bạn cho 3 thìa canh mắm tép, 1 thìa canh ớt bột không cay và 1 thìa canh hạt nêm vào chảo. Bạn hạ nhỏ lửa, đảo đều tay để các gia vị quyện chặt và thấm đều vào từng miếng thịt. Khi hỗn hợp sốt mắm tép đã sánh lại, bao quanh miếng thịt vàng óng thì bạn tắt bếp và múc ra đĩa.	5	/culinary-blog/recipes/0328808d-a3ff-572c-9a61-fc373949e163/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
645c5679-745a-4768-b256-70cd475f2a35	0328808d-a3ff-572c-9a61-fc373949e163	5	Thành phẩm	Miếng thịt ba chỉ vàng đều, cháy cạnh thơm lừng. Khi ăn, bạn sẽ cảm nhận được vị mặn ngọt hài hòa, cay nhẹ kích thích vị giác quyện cùng hương thơm đặc trưng của mắm tép, hành, tỏi và sả. Món này ăn kèm cơm trắng nóng hổi là tuyệt hảo nhất.	5	/culinary-blog/recipes/0328808d-a3ff-572c-9a61-fc373949e163/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a706b55e-791b-420a-aee3-456df8e1f9e9	5d86a6bc-b484-57ad-ade8-562a33b59cfc	1	Chiên cá vàng giòn	Bạn rửa sạch lát cá thu, dùng khăn giấy thấm khô các mặt cá để khi chiên ít bị văng dầu. Bắc chảo lên bếp, cho lượng dầu ăn vừa đủ ngậm đáy chảo. Khi dầu nóng, cho lát cá thu vào chiên lửa vừa. Bạn lưu ý lật trở mặt cá cẩn thận để cá được chín vàng đều cả hai mặt, sau đó vớt cá ra đĩa cho ráo dầu.	15	/culinary-blog/recipes/5d86a6bc-b484-57ad-ade8-562a33b59cfc/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2a08a04c-1165-4e45-ae64-78d1bb6e54fc	5d86a6bc-b484-57ad-ade8-562a33b59cfc	2	Làm nước sốt cam	Bạn vắt lấy nước cốt từ 2 trái cam vào một bát nhỏ. Tiếp theo, bạn cho vào bát nước cam các gia vị gồm: 1 muỗng hạt nêm, 1 muỗng bột ngọt, 1 muỗng đường, 2 muỗng canh nước mắm và một ít tiêu. Bạn dùng muỗng khuấy thật đều tay để toàn bộ gia vị hòa quyện vào nhau.	7	/culinary-blog/recipes/5d86a6bc-b484-57ad-ade8-562a33b59cfc/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
81c33ac1-b623-4357-bcd0-27028514a9c8	5d86a6bc-b484-57ad-ade8-562a33b59cfc	3	Cách làm cá thu sốt cam đậm đà	Bạn tận dụng chảo vừa chiên cá (hoặc dùng chảo mới), phi thơm hỗn hợp hành và tỏi đã băm nhỏ. Khi hành tỏi đã dậy mùi thơm, bạn đổ bát nước sốt cam vào, đun đến khi nước sốt sôi và bắt đầu nóng lên thì bạn cho lát cá thu đã chiên vào. Bạn dùng muỗng múc nước sốt rưới liên tục lên mặt cá để cá thấm đều gia vị, đun thêm một lúc cho nước sốt hơi sánh lại thì tắt bếp.	5	/culinary-blog/recipes/5d86a6bc-b484-57ad-ade8-562a33b59cfc/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0df50647-2719-4f92-83e2-c8973c03aa13	5d86a6bc-b484-57ad-ade8-562a33b59cfc	4	Thành phẩm	Cho cá ra đĩa, rưới nước sốt cam lên trên và rắc hành lá. Món cá thu sốt chua ngọt này có lớp da dai nhẹ, thịt ngọt lịm, là món chính cực kỳ đưa cơm.	5	/culinary-blog/recipes/5d86a6bc-b484-57ad-ade8-562a33b59cfc/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5c93a029-201b-4b21-8e18-e1019dd8d28a	28b8f38a-632d-572c-b260-34207bfdd35f	1	Sơ chế thịt cua	Cua mua về rửa sạch, hấp chín rồi tỉ mỉ lột lấy phần thịt cua bể. Các bác nhớ giữ lại phần mai và càng cua để trang trí cho sinh động.	90	/culinary-blog/recipes/28b8f38a-632d-572c-b260-34207bfdd35f/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
fba7ea92-b77f-4979-b902-bc5f4a0baa01	28b8f38a-632d-572c-b260-34207bfdd35f	2	Xào cua, nấm hương và lạp xưởng cùng xôi	Sử dụng dầu hành vừa phi để phi thơm đầu hành, sau đó cho nấm hương và lạp xưởng vào đảo đều. Tiếp đến cho thịt cua vào, nêm 1 muỗng canh dầu hào và 1/4 muỗng cà phê tiêu cho dậy mùi thơm. Cuối cùng là trộn đều phần nhân này cùng hành lá và xôi trắng nóng hổi.	45	/culinary-blog/recipes/28b8f38a-632d-572c-b260-34207bfdd35f/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b82c9c50-c340-4d16-88e3-c72cc9030585	28b8f38a-632d-572c-b260-34207bfdd35f	3	Chiên vỏ xôi giòn rụm	Đây là bước quan trọng để tạo nên sự đặc biệt của món xôi cua này. Bạn dàn mỏng xôi vào tô hoặc thau inox rồi đem chiên ngập dầu. Trong quá trình chiên cần xoay đều tay để vòng xôi vàng đều, tròn trịa. Khi xôi đã vàng giòn thì vớt ra để nguội bớt, vỏ xôi sẽ tự tróc ra khỏi bát dễ dàng.	30	/culinary-blog/recipes/28b8f38a-632d-572c-b260-34207bfdd35f/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cccb178a-7bf5-445a-9d87-95afdb30f680	28b8f38a-632d-572c-b260-34207bfdd35f	4	Thành phẩm	Xếp phần nhân xôi cua, thêm thịt cua và hành lá bào sợi vào bên trong vỏ xôi chiên giòn, đặt mai cua lên trên cùng chân cua trang trí. Món xôi cua hoàn thành với vỏ ngoài giòn tan, bên trong xôi dẻo quyện cùng nhân cua ngọt thơm, lạp xưởng và hành phi béo ngậy.	22	/culinary-blog/recipes/28b8f38a-632d-572c-b260-34207bfdd35f/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d81ca61e-e190-41ed-a2cd-9c99ff75d2a1	f7c4667e-40e8-5e83-97c3-1beb5319a200	1	Sơ chế và ướp gà	Gà ta sau khi mua về bạn làm sạch, để ráo nước. Bạn cho gà vào khay lớn. Với con gà khoảng 1.8kg thì bạn tiến hành ướp với 1 muỗng canh hạt nêm, 1/2 muỗng canh đường, 3 muỗng canh nước mắm, 3 muỗng canh dầu hào, 1/2 muỗng canh tiêu xay, hành tím và tỏi băm nhỏ cùng 1 muỗng cà phê bột nghệ để tạo màu. Bạn đeo bao tay, thoa đều hỗn hợp gia vị lên khắp mình gà và bên trong bụng gà, để gà thấm trong khoảng 30 phút trước khi hấp.	52	/culinary-blog/recipes/f7c4667e-40e8-5e83-97c3-1beb5319a200/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
12e968ca-bece-479b-b47b-d7d0a2d9fc8a	f7c4667e-40e8-5e83-97c3-1beb5319a200	2	Sơ chế rau củ	Quả bầu bạn gọt vỏ, rửa sạch và cắt thành những miếng tròn vừa ăn. Ngô ngọt bạn lột vỏ, bỏ xơ và cắt khúc tròn. Hành lá rửa sạch, cắt khúc dài. Nấm đùi gà mini rửa sạch, để ráo. Hành tây bạn bóc vỏ, cắt thành những khoanh tròn dày để lót đáy nồi.	26	/culinary-blog/recipes/f7c4667e-40e8-5e83-97c3-1beb5319a200/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
39a7e6d2-0359-4e3e-932f-e25c8475c649	f7c4667e-40e8-5e83-97c3-1beb5319a200	3	Hấp gà	Bạn xếp các khoanh hành tây xuống dưới đáy nồi để chống dính và tạo mùi thơm, sau đó đặt gà đã ướp vào. Bạn đổ thêm 1 chén nước dừa vào nồi để tạo vị ngọt thanh. Đậy nắp và hấp gà ở lửa thật nhỏ trong khoảng 30 phút cho thịt gà chín mềm từ bên trong.	17	/culinary-blog/recipes/f7c4667e-40e8-5e83-97c3-1beb5319a200/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
aa5f0466-5c95-4529-a62f-f0b8594a39ae	f7c4667e-40e8-5e83-97c3-1beb5319a200	4	Hấp kèm rau củ	Khi gà đã hấp được 30 phút, bạn mở nắp nồi và lần lượt xếp ngô ngọt, nấm đùi gà và bầu vào xung quanh con gà. Tiếp tục đậy nắp và hấp thêm 10 phút nữa. Cuối cùng, bạn cho hành lá cắt khúc lên trên, đậy nắp hấp thêm khoảng 2 phút cho hành vừa chín tới là có thể tắt bếp.	13	/culinary-blog/recipes/f7c4667e-40e8-5e83-97c3-1beb5319a200/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a51988fb-93f4-4f1a-9c0b-75fae190a87f	f7c4667e-40e8-5e83-97c3-1beb5319a200	5	Làm nước chấm và hoàn thành	Bạn pha nước chấm theo công thức: 2 muỗng đường, 2 muỗng muối tiêu cay, 2 muỗng nước cốt chanh và vài quả ớt xiêm xanh đập dập, khuấy đều cho hỗn hợp sánh mịn. Bày gà ra đĩa cùng rau củ, tưới thêm nước hấp gà lên trên là hoàn tất.	10	/culinary-blog/recipes/f7c4667e-40e8-5e83-97c3-1beb5319a200/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cc85541f-4668-4078-bde8-3166e9952468	f7c4667e-40e8-5e83-97c3-1beb5319a200	6	Thành phẩm	Món gà hấp bầu sau khi hoàn thành có màu vàng óng bắt mắt của bột nghệ. Thịt gà dai ngọt, thơm lừng mùi nước dừa và hành tây. Bầu, ngô và nấm chín tới giữ được độ giòn ngọt tự nhiên, chấm cùng nước muối tiêu chanh ớt xiêm xanh cay nồng sẽ tạo nên một hương vị vô cùng bùng nổ.	8	/culinary-blog/recipes/f7c4667e-40e8-5e83-97c3-1beb5319a200/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
17cee8b8-8997-49a1-bda1-6c62f08a6cd4	bfd455b1-f053-5cff-8c63-b67f40072494	1	Sơ chế mực tươi	Để làm món mực hấp gừng sả được ngon, trước tiên chúng ta cần sơ chế mực thật khéo léo. Bạn hãy rút túi mực ra mà không làm rơi đầu mực để khi hấp trông đẹp mắt. Giữ lại phần xương sống để mực không bị co lại. Vỏ lụa bên ngoài cũng không cần lột để mực có màu tím hồng đẹp mắt. Nếu không thích, bạn có thể nặn phần răng mực ở chính giữa các xúc tu. Sau đó, rửa nhẹ mực qua nước muối loãng, xả lại nước sạch và để ráo.	10	/culinary-blog/recipes/bfd455b1-f053-5cff-8c63-b67f40072494/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7abee4eb-1cb6-432a-a4d2-2afbe3fbd7b4	bfd455b1-f053-5cff-8c63-b67f40072494	2	Sơ chế gừng và các loại rau củ khác	Gừng giữ lại vỏ, rửa sạch, một phần đập dập và một phần xắt sợi để hấp và trang trí. Với sả, bóc bỏ lớp vỏ héo bên ngoài, rửa sạch, đập dập và cắt khúc. Ớt sừng dùng một nửa thái sợi, nửa còn lại xắt lát chéo. Cần tây ngâm rửa sạch với nước muối rồi cắt khúc dài khoảng 6-7 cm. Hành tây sau khi lột vỏ thì bổ múi cau nhỏ. Khi hấp mực, việc thêm hành tây và cần tây sẽ giúp món ăn tăng thêm hương vị thơm thanh, giòn ngọt hấp dẫn. Đầu hành lá rửa sạch và giữ nguyên. Các loại rau thơm ăn kèm như lá lốt, rau răm, bạc hà, dưa chuột thì nhặt và ngâm rửa nước muối sạch sẽ, để ráo nước. Dưa chuột xắt lát vừa ăn nhé.	5	/culinary-blog/recipes/bfd455b1-f053-5cff-8c63-b67f40072494/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
86f4f6ab-2ae4-476e-a1b8-4f272630a281	bfd455b1-f053-5cff-8c63-b67f40072494	3	Hấp mực với gừng thơm lừng	Cho nước vào nồi, lượng nước áng chừng khoảng 1/2 khoảng cách từ đáy nồi đến vị trí xửng hấp. Tiếp theo, thả sả và gừng đập dập vào nồi rồi nấu sôi nước lên. Khi nước đã sôi, bạn xếp mực vào vỉ hấp và đậy nắp nồi. Hấp mực ở lửa lớn vừa trong khoảng 5 đến 6 phút là mực sẽ chín tới và giòn ngọt.	5	/culinary-blog/recipes/bfd455b1-f053-5cff-8c63-b67f40072494/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6bf61593-0cfe-4997-9478-12948acb6d01	bfd455b1-f053-5cff-8c63-b67f40072494	4	Pha nước chấm mắm gừng chuẩn vị	Đầu tiên, băm nhỏ tỏi, sả và gừng. Pha nước chấm với 5 thìa canh nước mắm, gần 2 thìa canh đường và 3 thìa canh nước cốt chanh. Khuấy đều cho đường tan hoàn toàn. Sau khi đường đã tan, cho sả, gừng, tỏi, ớt băm vào và khuấy đều. Nếu thích, bạn có thể rắc thêm một ít tiêu xay lên trên để tăng hương vị.	5	/culinary-blog/recipes/bfd455b1-f053-5cff-8c63-b67f40072494/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
93f678d9-4fc0-4bf0-b2d4-9826b3664879	bfd455b1-f053-5cff-8c63-b67f40072494	5	Thành phẩm	Lúc này, mực hấp cũng đã chín tới rồi. Bạn hãy cho mực ra đĩa, bày biện thêm nước chấm mắm gừng và rau thơm, dưa chuột ăn kèm. Mực tươi được hấp chín trong thời gian phù hợp nên rất giòn và ngọt. Các loại rau củ hấp kèm như sả, gừng, hành tây, cần tây không chỉ tăng thêm hương vị mà còn làm món ăn đẹp mắt hơn. Đặc biệt, nước chấm mắm gừng vừa vị sẽ càng giúp món mực hấp thơm ngon hơn rất nhiều. Món mực hấp này nên ăn lúc nóng, bạn có thể để nguyên con hoặc cắt nhỏ miếng tùy ý nhé.	5	/culinary-blog/recipes/bfd455b1-f053-5cff-8c63-b67f40072494/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e55cf98e-f1f4-42bf-8206-e3b14da574b6	874dd168-04dc-5ff5-8b0c-46fe08b54760	1	Sơ chế và tạo hình gà	Gà sau khi mổ sạch, bạn dùng quả tắc hoặc chanh cùng muối trắng chà xát kỹ toàn bộ thân gà. Việc massage này giúp khử sạch mùi hôi tanh, giúp da gà sạch và thơm ngon hơn sau khi chế biến. Tiếp theo, bạn tạo hình gà bằng cách bẻ chân cho vào trong bụng, đầu và cổ gà thì kẹp gọn vào cánh. Cách làm này giúp gà có hình dáng gọn gàng, đẹp mắt và không bị chiếm quá nhiều diện tích khi cho vào nồi.	45	/culinary-blog/recipes/874dd168-04dc-5ff5-8b0c-46fe08b54760/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6ee3bb87-805d-4ca5-ab38-4ede1976a705	874dd168-04dc-5ff5-8b0c-46fe08b54760	2	Nấu nước gia vị làm gà ủ muối thảo mộc	Bạn cho 16 lít nước vào nồi lớn, sau đó cho tất cả thảo mộc gồm hoa hồi, thảo quả đập dập, hoa tiêu, quế chi, đinh hương, mắc khén vào. Đừng quên thêm ớt khô và lá chanh để tạo mùi thơm đặc trưng. Đun sôi hỗn hợp này trong khoảng 15 - 20 phút. Đây là công đoạn quan trọng để các loại thảo mộc tiết hết tinh dầu và mùi thơm nồng nàn ra nước dùng.	22	/culinary-blog/recipes/874dd168-04dc-5ff5-8b0c-46fe08b54760/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d581e6d5-6809-4a65-8f06-6444103fb9a3	874dd168-04dc-5ff5-8b0c-46fe08b54760	3	Ủ gà	Sau khi đun thảo mộc, bạn cho 400gr đường vàng, 200gr mì chính, 200gr muối tinh, 220gr hạt nêm Knorr, 160gr bột thịt gà Knorr, 20gr cốt gà, 30gr tinh bột nghệ và 100gr muối đỏ vào nồi rồi khuấy tan. Cho gà vào nồi, dùng một chiếc thớt nặng chèn lên trên để đảm bảo gà ngập hoàn toàn trong nước. Tiến hành ủ gà từ 4 - 6 tiếng, lưu ý cứ mỗi 2 tiếng nên đảo gà một lần để màu sắc và gia vị thấm đều.	15	/culinary-blog/recipes/874dd168-04dc-5ff5-8b0c-46fe08b54760/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
641ca77c-527b-4691-89c9-455ebfa6f24c	874dd168-04dc-5ff5-8b0c-46fe08b54760	4	Luộc gà ủ muối hoa tiêu thảo mộc	Bật bếp đun sôi nồi gà trở lại, sau đó hạ lửa nhỏ để nước sôi lăn tăn trong 15 phút nhằm giữ cho da gà không bị nứt. Tắt bếp và tiếp tục để gà trong nồi ủ thêm 15 - 30 phút tùy vào kích thước gà. Cuối cùng, vớt gà ra. Đợi gà nguội hẳn, bạn có thể đem đi hút chân không để bảo quản thực phẩm được lâu hơn.	11	/culinary-blog/recipes/874dd168-04dc-5ff5-8b0c-46fe08b54760/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e4240df4-f346-402e-86df-2686da6b65eb	874dd168-04dc-5ff5-8b0c-46fe08b54760	5	Thành phẩm	Gà ủ muối thảo mộc sau khi hoàn thành sẽ có lớp da giòn sần sật, thịt gà dai ngọt thấm đẫm hương vị đặc sản vùng miền. Màu vàng từ nghệ tươi giúp món ăn trông vô cùng hấp dẫn, cực kỳ phù hợp cho các bữa tiệc gia đình. Gà thành phẩm sau khi hút chân không có thể bảo quản trong ngăn mát tủ lạnh trong vòng 2 tuần. Nếu muốn để lâu hơn, bạn có thể bảo quản trong ngăn đá được vài tháng. Khi ăn chỉ cần rã đông tự nhiên hoặc làm nóng lại bằng lò vi sóng, nồi chiên không dầu.	9	/culinary-blog/recipes/874dd168-04dc-5ff5-8b0c-46fe08b54760/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
338c04c2-a88f-473a-943c-08c005bfddd0	2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6	1	Sơ chế nước cốt nghệ và ngâm gạo	Bạn lấy 10gr nghệ tươi đem giã nhuyễn, sau đó hòa với một ít nước lọc rồi lọc qua rây để lấy phần nước cốt nghệ vàng. Đem 400gr gạo nếp đãi sạch, cho vào thau rồi đổ nước cốt nghệ vào ngâm, thêm một ít nước cốt chanh để màu sắc đẹp hơn. Tiến hành ngâm gạo trong khoảng 8 tiếng.	50	/culinary-blog/recipes/2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ee0384cf-1508-4109-af50-f688c7b1fcae	2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6	2	Cách làm hành phi vàng giòn	Bạn bóc vỏ 20gr hành khô rồi dùng dao thái thành các lát mỏng đều nhau. Sau đó, cho hành vào chảo dầu nóng, phi ở lửa vừa cho đến khi hành chuyển sang màu vàng giòn thì vớt ra để ráo dầu. Phần dầu hành này bạn hãy giữ lại để trộn vào xôi giúp hạt xôi bóng mượt hơn.	25	/culinary-blog/recipes/2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c48876c0-c2ce-485a-b4fb-61addc93de58	2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6	3	Đồ xôi lần 1	Vớt gạo nếp đã ngâm đủ thời gian ra rổ và để cho thật ráo nước. Tiếp theo, bạn cho gạo vào bát lớn, thêm một ít muối hạt và 3 thìa dầu vừa phi hành vào rồi dùng thìa trộn thật đều để từng hạt gạo được bao phủ một lớp dầu bóng mượt. Bạn cho 1.5 lít nước vào nồi hấp và đun sôi. Khi nước đã sôi, cho gạo nếp vào xửng hấp xôi, dùng đũa chọc vài lỗ trên bề mặt gạo để hơi nước dễ dàng tỏa đều. Đậy nắp, để lửa nhỏ và đồ xôi trong vòng 30 phút cho hạt gạo chín tới.	16	/culinary-blog/recipes/2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
764e8f00-2999-49c9-bf2f-6f5e118fe2c6	2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6	4	Đồ xôi hai lửa giúp hạt chín dẻo	Sau khi đồ lần 1, bạn lấy xôi ra bát, rưới thêm một chút dầu hành vào và trộn đều cho hạt xôi tơi. Tiếp tục cho xôi vào xửng hấp lần 2 thêm khoảng 15 - 20 phút nữa cho đến khi hạt xôi chín dẻo hoàn toàn như cách làm xôi vò hạt rời thì tắt bếp.	12	/culinary-blog/recipes/2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
545dbfea-eb11-4164-8003-bcee801ff618	2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6	5	Thành phẩm	Múc xôi ra đĩa, dùng muôi dàn phẳng rồi rắc đều hành phi và một ít ruốc bông lên trên bề mặt. Món xôi hoàng phố hoàn thành có màu vàng rực rỡ, hạt xôi bóng bẩy, dẻo thơm hòa quyện cùng vị béo của dầu hành và vị đậm đà của ruốc bông, rất phù hợp cho mâm cỗ truyền thống.	10	/culinary-blog/recipes/2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5aef7263-4d20-4d77-998d-c0a2926b6295	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	1	Sơ chế và ướp thịt bò	Đầu tiên, với 200gr thịt bò mua về bạn đem rửa sạch, sau đó lấy khăn ẩm sạch lau sơ qua bề mặt thịt để loại bỏ các bụi bẩn còn sót lại, rồi dùng dao cắt thành từng lát mỏng vừa ăn. Kế đến, bạn lấy cái chén cùng toàn bộ phần thịt bò vừa cắt, 1 muỗng cà phê dầu hào, 1/2 muỗng cà phê hạt nêm, 1/2 muỗng cà phê tiêu xay và 1 muỗng cà phê tỏi băm vào, trộn đều lên rồi để thịt bò được thấm đều gia vị trong vòng 10 phút.	30	/culinary-blog/recipes/0a801e01-03a1-547c-8ab7-1cfb4dce7e19/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5a8ab0fd-3d5d-4bce-a239-5fa41e4b69fd	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	2	Sơ chế các nguyên liệu khác	Cà rốt, đu đủ xanh mua về bạn gọt vỏ, rửa sạch rồi để ráo. Sau đó, dùng dao bào bào cả 2 nguyên liệu thành từng sợi mỏng vừa ăn. Kế đến, lấy tô rồi cho toàn bộ phần cà rốt, đu đủ xanh vừa bào sợi, 2 muỗng canh đường và 2 muỗng canh giấm vào, dùng đũa đảo đều rồi để đồ chua được thấm đều gia vị khoảng 15 - 20 phút. Còn với xà lách, giá đỗ thì bạn bỏ bớt các phần dập úng rồi đem rửa với nước sạch vài lần, để ráo. Cuối cùng, bạn đem xà lách cắt thành từng khúc vừa ăn nữa là được.	15	/culinary-blog/recipes/0a801e01-03a1-547c-8ab7-1cfb4dce7e19/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
37636d19-cb87-4075-8ecd-526fe8c3ed1e	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	3	Làm đồ chua cà rốt giòn ngon	Cà rốt đã bào sợi bạn cho vào tô. Thêm 2 muỗng canh đường, 2 muỗng canh giấm và một ít muối. Trộn đều hỗn hợp và ướp khoảng 1 đến 2 tiếng là có thể dùng được.	15	/culinary-blog/recipes/af002a60-e2a8-5f3a-b595-ad6bb4dfba0d/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f71e31a1-d5e8-4a0f-aa4a-adeecc0d961d	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	3	Làm sốt trộn	Chuẩn bị nguyên liệu xong, bạn lấy chén rồi cho 2 muỗng canh nước mắm, 2 muỗng canh đường, 1 muỗng canh giấm và 6 muỗng canh nước ấm vào, dùng muỗng khuấy đều đến khi hỗn hợp được hòa tan với nhau. Thấy đường đã tan, thì bạn nêm nếm gia vị vừa ăn rồi thêm nốt 1 muỗng cà phê tỏi băm và 1 muỗng cà phê ớt băm vào, đảo đều lên lần nữa là được rồi nhé!	10	/culinary-blog/recipes/0a801e01-03a1-547c-8ab7-1cfb4dce7e19/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3e2df44e-18ad-44f9-a0e2-981f3f73bce4	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	4	Xào bò	Kế đến, bắc chảo lên bếp cùng 2 muỗng canh dầu ăn và 2 muỗng cà phê tỏi băm còn lại vào phi thơm với lửa vừa. Sau đó, cho 200gr thịt bò đã ướp vào, dùng đũa xào đều khoảng 3 phút. Cuối cùng, bạn tiếp tục thêm nốt 150gr giá đỗ đã rửa vào, đảo đều 3 phút nữa rồi nêm nếm gia vị vừa ăn, tắt bếp cho ra dĩa.	7	/culinary-blog/recipes/0a801e01-03a1-547c-8ab7-1cfb4dce7e19/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0d2191ba-823d-4cf2-8e6d-ad2fb621a29c	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	5	Hoàn thành	Chuẩn bị nguyên liệu xong, bạn lấy tô rồi lần lượt cho rau xà lách đã rửa, bánh phở, đồ chua, thịt bò vừa xào cùng giá đỗ, đậu phộng rang và 1 ít nước sốt trộn vào, trộn đều lên nữa là thưởng thức được rồi nhé!	6	/culinary-blog/recipes/0a801e01-03a1-547c-8ab7-1cfb4dce7e19/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
830ff47f-44e4-4dd1-8229-b253b0db2055	0a801e01-03a1-547c-8ab7-1cfb4dce7e19	6	Thành phẩm	Phở bò trộn không nhiều dầu mỡ sẽ là sự lựa chọn lý tưởng mà bạn có thể dành tặng cho các thành viên trong gia đình mình để đổi vị. Hương thơm thoang thoảng từ thịt bò mềm ngọt lại còn đậm đà thật cuốn hút. Đặc biệt, khi kết hợp cùng bún tươi trắng nõn, đồ chua chua chua ngọt ngọt và xà lách tươi xanh làm cho ăn mãi mà không biết ngán là gì. À mà sự thơm ngon ấy làm sao thiếu được chén nước sốt trộn mặn ngọt cay cay nơi đầu lưỡi được. Ngoài ra, bạn còn có thể chuẩn bị thêm 1 ít rau thơm để ăn cùng nữa nhé!	5	/culinary-blog/recipes/0a801e01-03a1-547c-8ab7-1cfb4dce7e19/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c4923683-8425-445a-b628-09410b8cf837	7a541a1d-207a-515c-93c3-2424f0c1d745	1	Sơ chế nguyên liệu	Thịt ba chỉ chà xát với muối hạt rồi rửa sạch. Thái thịt thành các lát mỏng khoảng 0.5cm. Sả cây bạn bào mỏng rồi băm nhuyễn. Tỏi bạn cũng băm nhỏ. Hành tím thì lấy 3 củ để băm nhỏ. Hành lá thì bạn cắt riêng phần lá và phần gốc hành. Lá hành bạn thái nhỏ, gốc hành thì chẻ sợi nhỏ. Bạn rửa sạch cà chua rồi cắt nhỏ vừa.	85	/culinary-blog/recipes/7a541a1d-207a-515c-93c3-2424f0c1d745/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
01a1864a-9eeb-461b-ab57-fce9c96f7c69	7a541a1d-207a-515c-93c3-2424f0c1d745	2	Ướp thịt và chả nướng	Bạn cho thịt xay và thịt thái lát vào 2 tô lớn khác nhau. Ướp vào mỗi tô các gia vị với định lượng như sau: 1/2 thìa canh nước hàng, 1 thìa canh dầu hào, 1 thìa canh nước mắm, 1 thìa canh sữa đặc, 1 thìa cà phê đường, 2 thìa canh dầu ăn và một ít tiêu đen. Cuối cùng cho thêm hành tím, tỏi, sả đã băm nhỏ vào mỗi tô rồi trộn đều. Bạn nhớ để lại một ít tỏi băm để xào cà chua nhé. Ướp thịt từ 15 - 20 phút để gia vị thấm sâu.	42	/culinary-blog/recipes/7a541a1d-207a-515c-93c3-2424f0c1d745/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
30a8b796-37e4-423e-9091-b295f1763218	7a541a1d-207a-515c-93c3-2424f0c1d745	3	Nướng chả	Làm nóng nồi chiên không dầu ở 200 độ C trong vòng 7 phút. Bạn chia nhỏ phần thịt băm rồi nặn thành các viên chả vừa phải. Xếp chả viên và chả thịt vào nồi, tiến hành nướng lần 1 ở 200 độ C trong 15 phút. Sau đó, bạn trở mặt chả, giữ nguyên nhiệt độ và nướng tiếp lần 2 trong 6 phút.	28	/culinary-blog/recipes/7a541a1d-207a-515c-93c3-2424f0c1d745/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5f78bce0-3704-415a-8bfc-c9169d623ed2	7a541a1d-207a-515c-93c3-2424f0c1d745	4	Nấu nước dùng bún chả chan	Bạn rửa sạch xương heo, chần sơ xương trong nước sôi khoảng 2 - 3 phút rồi vớt ra, rửa lại cho sạch. Cho xương vào nồi, cho thêm 2.5 lít nước, 2 củ hành tím và 1 thìa cà phê muối vào nồi. Tiến hành ninh xương trong khoảng 30 - 60 phút cho xương tiết nước ngọt. Bắc chảo lên bếp, cho vào chảo 1 thìa canh dầu ăn rồi cho tỏi vào, phi thơm. Tiếp đến, bạn cho cà chua vào, xào trong khoảng 5 phút, cho đến khi cà chua mềm nhừ. Bạn trút phần cà chua xào vào nồi nước dùng, nêm thêm 1/2 thìa canh hạt nêm, 1 thìa canh nước mắm và 1 thìa cà phê mì chính. Nêm nếm gia vị lại cho hợp khẩu vị gia đình.	21	/culinary-blog/recipes/7a541a1d-207a-515c-93c3-2424f0c1d745/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8f50ed72-69b4-40e8-b11c-0448a0369af1	7a541a1d-207a-515c-93c3-2424f0c1d745	5	Thành phẩm	Cho bún rối vào tô, xếp các viên chả nướng lên trên cùng hành lá thái nhỏ và các loại rau sống tươi ngon. Cuối cùng, dội nước dùng bún chả chan nóng hổi vào tô rồi thưởng thức. Món ăn đạt yêu cầu khi nước dùng có vị ngọt thanh, thịt nướng thơm phức hòa quyện cùng vị tươi mát của rau sống, tạo nên một hương vị khó quên.	17	/culinary-blog/recipes/7a541a1d-207a-515c-93c3-2424f0c1d745/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
10c4be76-120e-4578-88c2-4fe43c9639ff	a42c812f-4e4a-5ce4-b574-d95c084350f8	1	Chế biến sợi hủ tiếu dai	Trộn 200 gr bột gạo, 60 gr bột năng với nước lạnh và một chút muối, khuấy đều cho tan hoàn toàn. Để hỗn hợp nghỉ 1 đêm, sau đó chắt bỏ lớp nước chua bên trên, thêm 350ml nước mới rồi khuấy đều.	60	/culinary-blog/recipes/a42c812f-4e4a-5ce4-b574-d95c084350f8/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8e5e4478-c0d7-495a-b740-e49b292b17f7	a42c812f-4e4a-5ce4-b574-d95c084350f8	2	Hấp chín và cắt sợi hủ tiếu	Chuẩn bị 1 nồi hấp, đổ 1 lớp bột mỏng vào khay và hấp trong 10 phút, sau đó lấy ra và quét mỏng lớp dầu lên mặt bánh. Bạn tiếp tục hấp mẻ mới cho đến khi đủ số lượng bánh, sau đó cắt bánh thành sợi hủ tiếu.	30	/culinary-blog/recipes/a42c812f-4e4a-5ce4-b574-d95c084350f8/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
35fc6e79-c59e-4093-ad58-5f90c020924b	a42c812f-4e4a-5ce4-b574-d95c084350f8	3	Sơ chế nhân tôm và bì thịt	Tôm rang chín với ít muối, bóc vỏ và băm nhỏ thịt tôm. Phi thơm tỏi băm, cho tôm vào xào chín tới. Chuẩn bị thêm thịt heo khìa rồi thái sợi. Bì heo làm sạch, trộn đều cùng tỏi băm và thính gạo.	20	/culinary-blog/recipes/a42c812f-4e4a-5ce4-b574-d95c084350f8/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d788ea7b-988d-4311-9c48-7d6bb47ee07e	a42c812f-4e4a-5ce4-b574-d95c084350f8	4	Làm chả giò khoai môn tôm thịt	Chuẩn bị phần nhân gồm 1/2 củ khoai môn bào, 1 củ cà rốt bào, 200 gr thịt băm, 100 gr tôm băm, 1 lọn bún tàu, 1 quả trứng gà, 1 muỗng hành tím và tỏi băm. Trộn đều nhân và chô vào bánh tráng, gói lại rồi đem chiên vàng giòn.	15	/culinary-blog/recipes/a42c812f-4e4a-5ce4-b574-d95c084350f8/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b61dda04-04d0-4289-b451-1e123abfa93b	a42c812f-4e4a-5ce4-b574-d95c084350f8	5	Thành phẩm	Khi ăn, bạn lấy hủ tiếu hấp nóng cho vào tô, dùng kèm dưa leo bào, giá sống, đồ chua, bì trộn, thịt khìa, tôm xào và chả giò chiên. Điểm xuyến thêm vị béo của nước cốt dừa, giòn béo của đậu phộng, hoà quyện cùng nước mắm tỏi ớt chua ngọt, tạo nên hương vị đặc trưng, ấn tượng khó quên.	12	/culinary-blog/recipes/a42c812f-4e4a-5ce4-b574-d95c084350f8/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3bc2d8c8-8e81-429e-8036-a4b9704f7b30	13627a6f-e0c2-5c41-88b5-6bc66344b541	1	Sơ chế và rang nguyên liệu	Rang vàng khô mực, tôm khô và củ hành tím để dậy mùi thơm. Sau đó rửa sạch và cho tất cả vào túi lọc gia vị.	240	/culinary-blog/recipes/13627a6f-e0c2-5c41-88b5-6bc66344b541/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
25c9eb60-6126-438c-b604-19ce3da72473	13627a6f-e0c2-5c41-88b5-6bc66344b541	2	Trụng xương và phèo	Trụng xương heo và phèo với nước sôi có pha chút gừng để loại bỏ tạp chất, giúp nước dùng khi nấu sẽ trong và thanh hơn.	120	/culinary-blog/recipes/13627a6f-e0c2-5c41-88b5-6bc66344b541/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e5873465-d633-4e04-bb69-8f85648f559a	13627a6f-e0c2-5c41-88b5-6bc66344b541	3	Nấu nước dùng hủ tiếu	Cho xương, phèo, túi lọc gia vị, củ cải trắng vào nồi nước và ninh lửa nhỏ trong 2 - 4 giờ đồng hồ. Trong lúc ninh xương, bạn nhớ vớt bọt thường xuyên để nước dùng trong. Sau khi ninh xong, bạn nêm đường phèn, muối, hạt nêm, bột ngọt, nước mắm và đường cát cho vừa với khẩu vị của gia đình. Sau đó cho thêm cà rốt tỉa hoa vào nấu chín. Mẹo nhỏ: Bạn có thể dùng nồi áp suất để ninh xương sẽ tiết kiệm thời gian hơn, chỉ với 20 - 30 phút hầm là đã có ngay nước dùng ngọt thanh rồi.	80	/culinary-blog/recipes/13627a6f-e0c2-5c41-88b5-6bc66344b541/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ea86d1f6-e54a-4adf-a80f-f0bc3569297b	13627a6f-e0c2-5c41-88b5-6bc66344b541	4	Chuẩn bị pate và các món kèm	Pate cắt miếng dày để không bị rã khi ăn. Gốc hành cắt khúc, lá hành cắt nhuyễn. Bạn chuẩn bị thêm chanh, ớt để ăn kèm.	60	/culinary-blog/recipes/13627a6f-e0c2-5c41-88b5-6bc66344b541/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0ef6388a-2637-4b52-ac77-1047758f87b1	13627a6f-e0c2-5c41-88b5-6bc66344b541	5	Thành phẩm	Trình bày hủ tiếu ra tô, xếp pate lên trên, chan nước dùng nóng hổi vào. Hủ tiếu pate Bến Tre với sợi hủ tiếu dai, nước dùng ngọt thanh và pate béo ngậy chắc chắn sẽ làm bạn hài lòng.	48	/culinary-blog/recipes/13627a6f-e0c2-5c41-88b5-6bc66344b541/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8fdaad89-85f7-4dde-ab64-a2e3b7633053	4e38d2f2-95fe-54b4-be87-08b700da58cb	1	Luộc sơ và sơ chế bì heo quay	Đầu tiên, bạn chuẩn bị một nồi nước, cho 20gr gừng và 3 cây sả đập dập vào đun sôi. Sau đó, bạn cho 1.2kg thịt ba chỉ vào luộc sơ trong khoảng 2 phút để thịt sạch và săn lại. Sau khi vớt ra, bạn dùng dụng cụ xăm thịt hoặc đầu tăm nhọn xăm thật kỹ và đều khắp phần bì heo. Tiếp theo, bạn đặt miếng thịt vào đĩa có chứa hỗn hợp 100ml giấm và 10gr muối tinh sao cho phần bì được ngâm trong hỗn hợp này khoảng 5 phút. Cuối cùng, bạn dùng khăn giấy sạch thấm thật khô bề mặt bì heo.	70	/culinary-blog/recipes/4e38d2f2-95fe-54b4-be87-08b700da58cb/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f81d551e-2c3f-4362-98b3-216c9e00404c	4e38d2f2-95fe-54b4-be87-08b700da58cb	2	Quay thịt bằng nồi chiên không dầu	Bạn sử dụng giấy bạc lót xung quanh miếng thịt, chỉ để lộ phần bì hướng lên trên. Sau đó, bạn phủ một lớp 300gr muối hột dày lên trên mặt bì heo. Bạn cho thịt vào nồi chiên không dầu nướng lần 1 ở nhiệt độ 120 độ C trong vòng 30 phút. Sau khi kết thúc lần 1, bạn lấy thịt ra, gạt bỏ hoàn toàn lớp muối hột trên bề mặt, sau đó dùng cọ quét một lớp dầu ăn mỏng lên bì. Bạn tiếp tục cho thịt vào nồi nướng lần 2 ở nhiệt độ 200 độ C trong 35 phút cho đến khi bì nổ đều, vàng ruộm và giòn tan.	35	/culinary-blog/recipes/4e38d2f2-95fe-54b4-be87-08b700da58cb/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0a3b8b8d-24c6-4cef-970a-74cfcf55eba6	4e38d2f2-95fe-54b4-be87-08b700da58cb	3	Làm nước chấm mắm nêm	Trong lúc nướng thịt, bạn bắc chảo lên bếp và phi thơm 1 ít tỏi băm cùng 150gr dứa băm nhỏ. Tiếp theo, bạn đổ 200ml mắm nêm nguyên chất vào chảo cùng khoảng 100ml nước lọc. Bạn thêm 50gr đường và 10gr bột ngọt vào (điều chỉnh lượng đường tùy theo độ chua của dứa và khẩu vị gia đình), đun sôi hỗn hợp rồi tắt bếp, để nguội.	23	/culinary-blog/recipes/4e38d2f2-95fe-54b4-be87-08b700da58cb/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7dbf4a41-5787-4246-a384-0600b4687c74	4e38d2f2-95fe-54b4-be87-08b700da58cb	4	Chuẩn bị rau củ và hoàn thiện	Bạn rửa sạch 2 cây xà lách và các loại rau thơm, ngò. 2 củ cà rốt, 2 quả dưa leo và phần dứa còn lại đem gọt vỏ rồi thái sợi dài vừa ăn. Khi thịt heo quay đã đạt độ giòn, bạn lấy ra khỏi nồi chiên và thái thành những miếng mỏng dài vừa ăn. Cuối cùng, bạn bày thịt quay, bún tươi, rau củ và mắm nêm ra mâm để cả nhà cùng cuốn và thưởng thức món bánh tráng heo quay hấp dẫn này.	17	/culinary-blog/recipes/4e38d2f2-95fe-54b4-be87-08b700da58cb/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3b6deef4-2244-4790-8220-f29609cee535	4e38d2f2-95fe-54b4-be87-08b700da58cb	5	Thành phẩm	Miếng thịt heo quay đạt chuẩn sẽ có lớp bì vàng ươm, nổ giòn rụm như bánh đa, phần thịt nạc và mỡ bên trong vẫn mềm và giữ được độ ngọt. Khi cuốn cùng bánh tráng, bún tươi, rau sống và chấm cùng mắm nêm đậm đà vị dứa, bạn sẽ cảm nhận được sự hòa quyện hoàn hảo giữa các hương vị.	14	/culinary-blog/recipes/4e38d2f2-95fe-54b4-be87-08b700da58cb/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c131df11-ea33-48f7-b8fd-0d2a9151743a	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	1	Nấu cơm và sơ chế nguyên liệu	Đầu tiên, bạn cho 350 gr gạo tẻ vào nồi và nấu cơm như cách bạn vẫn thường nấu ở nhà. Trong lúc chờ cơm chín, bạn băm nhuyễn 4 tép tỏi và 4 trái ớt. Cà rốt (100 gr) bạn bào sợi rồi cho vào tô. Tôm (50 gr) đã lột vỏ và rút chỉ đen, bạn băm nhuyễn hoặc xay nhuyễn, sau đó ướp với một ít hạt nêm và một ít tiêu xay. Trộn đều và ướp khoảng 15 phút. Chả lụa (250 gr) bạn xắt sợi nhuyễn. Dưa leo (1 trái) bạn xắt lát mỏng. Rau thơm (húng quế, húng lủi, ngò rí) bạn xắt nhuyễn.	45	/culinary-blog/recipes/af002a60-e2a8-5f3a-b595-ad6bb4dfba0d/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3d23697b-ae7b-436d-ac8e-5939299035c0	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	2	Ướp thịt ba rọi	Thịt heo ba rọi (250 gr) bạn cắt lát mỏng khoảng 1 cm. Cho thịt vào tô, ướp với một ít tỏi và ớt băm nhuyễn, 1 muỗng canh hạt nêm, nửa muỗng canh nước mắm và một ít đường. Trộn đều các nguyên liệu và ướp khoảng 20 phút để thịt thấm gia vị.	22	/culinary-blog/recipes/af002a60-e2a8-5f3a-b595-ad6bb4dfba0d/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d5f10ae5-4a08-4817-b5f2-877f976dadf0	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	4	Pha nước mắm chua ngọt đậm đà	Trong lúc chờ các nguyên liệu ướp, bạn chuẩn bị nước mắm. Cho 4 muỗng canh nước sôi vào chén, thêm 2 muỗng canh nước mắm, 1 muỗng canh nước cốt chanh và 2 muỗng canh đường. Khuấy đều cho đường tan hoàn toàn, sau đó cho phần tỏi ớt băm nhuyễn vào.	11	/culinary-blog/recipes/af002a60-e2a8-5f3a-b595-ad6bb4dfba0d/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e12c33e0-23c2-43e3-a638-b5121a79bab1	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	5	Chiên thịt và trứng vàng ươm	Chiên thịt: Làm nóng chảo với một ít dầu ăn. Cho thịt ba rọi đã ướp vào chiên với lửa vừa, trở đều các mặt cho đến khi miếng thịt chín vàng đều. Gắp thịt ra, xắt sợi nhuyễn. Chiên trứng: Đập 2 quả trứng gà vào tô, thêm một ít hạt nêm và tiêu, đánh đều. Làm nóng chảo với một ít dầu, lắc nhẹ để dầu tráng đều chảo rồi cho trứng vào chiên thật mỏng với lửa nhỏ cho đến khi trứng chín đều. Cuộn trứng lại và xắt sợi nhuyễn.	9	/culinary-blog/recipes/af002a60-e2a8-5f3a-b595-ad6bb4dfba0d/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
46338738-99d9-429f-88a7-e1236f754f26	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	6	Cháy tôm và làm mỡ hành thơm lừng	Cháy tôm: Cho một ít dầu ăn vào chảo, sau đó cho tôm băm đã ướp vào. Xào đều cho đến khi tôm săn lại và khô là được. Làm mỡ hành: Hành lá xắt nhuyễn cho vào chén, thêm một ít muối và một ít đường. Đun dầu ăn thật sôi rồi chế ngay vào chén hành, khuấy đều để hành chín và có màu xanh đẹp mắt.	7	/culinary-blog/recipes/af002a60-e2a8-5f3a-b595-ad6bb4dfba0d/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0a640ec7-7b9b-4fb6-8021-ca1151869a20	af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	7	Thành phẩm	Cơm đã nấu chín bạn múc ra chén rồi úp ngược vào giữa dĩa. Tiếp theo, bạn xếp các nguyên liệu đã sơ chế và chế biến (thịt chiên, trứng chiên, chả lụa, dưa leo, cà rốt ngâm chua, rau thơm) xung quanh phần cơm, mỗi thứ một ít vừa đủ ăn. Cho một ít tôm cháy lên trên mặt cơm. Cuối cùng, cho mỡ hành vào giữa phần cơm. Khi ăn, bạn chỉ cần trộn đều tất cả các nguyên liệu và chan nước mắm chua ngọt đã pha là có thể thưởng thức ngay.	6	/culinary-blog/recipes/af002a60-e2a8-5f3a-b595-ad6bb4dfba0d/steps/7.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
dbccc6c0-063c-42ba-a07c-9e9f2afdc358	fcb19486-2256-5ad6-a6a9-729b29adcbae	1	Pha bột làm bánh cuốn mềm mượt	Đầu tiên, chúng ta sẽ bắt tay vào pha bột để có được những chiếc bánh cuốn mềm mại nhất. Trong một tô lớn, bạn cho 120gr bột gạo, 30gr bột năng và 30gr bột tàn mì vào. Thêm 1/2 muỗng cà phê muối và 1 muỗng canh dầu ăn (dầu phi hành sẽ giúp bánh thơm hơn). Từ từ cho 320ml nước lạnh vào, khuấy đều cho bột tan hết. Cuối cùng, đổ thêm 240ml nước sôi vào, khuấy nhanh tay cho hỗn hợp bột mịn màng.	40	/culinary-blog/recipes/fcb19486-2256-5ad6-a6a9-729b29adcbae/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
5b988f43-360e-4c7a-90f1-eed3d2318daf	fcb19486-2256-5ad6-a6a9-729b29adcbae	2	Chuẩn bị nước chấm bánh cuốn đậm đà	Trong lúc đợi bột nghỉ, chúng ta sẽ pha nước sốt chấm, linh hồn của món bánh cuốn Quảng Đông. Cho 1 muỗng cà phê đường vào chén, thêm 2 muỗng canh nước sôi và khuấy đều cho đường tan hoàn toàn. Sau đó, cho 2 muỗng canh nước tương, 1 muỗng cà phê dầu mè và một ít sa tế (điều chỉnh theo khẩu vị) vào. Khuấy đều để các nguyên liệu hòa quyện, tạo nên hương vị nước chấm tuyệt vời.	20	/culinary-blog/recipes/fcb19486-2256-5ad6-a6a9-729b29adcbae/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d76a5a05-b117-4d31-90bb-f1141e549b7a	fcb19486-2256-5ad6-a6a9-729b29adcbae	3	Sơ chế nhân thịt và trứng gà	Hành lá rửa sạch, cắt riêng phần cọng trắng để ướp vào thịt xay, còn phần lá xanh thì thái nhỏ cho vào tô bột bánh. Cho 226gr thịt xay vào tô, thêm tiêu, 1/2 muỗng cà phê bột nêm chay, một chút đường, 1 muỗng cà phê lưng bột bắp và một chút xíu dầu ăn. Cho thêm phần cọng hành trắng đã cắt vào, trộn đều tất cả các nguyên liệu. Đánh tan 3 quả trứng gà trong một chén riêng.	13	/culinary-blog/recipes/fcb19486-2256-5ad6-a6a9-729b29adcbae/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2fc0cee8-9fac-48eb-83ca-bea1ce96b1a5	fcb19486-2256-5ad6-a6a9-729b29adcbae	4	Hấp bánh cuốn Quảng Đông thơm ngon	Chuẩn bị nồi hấp: Đổ nước vào nồi hấp (hoặc chảo sâu lòng), đun sôi. Dùng dầu phi hành thoa đều 3 khuôn hấp. Khi nước trong nồi đã sôi, đặt các khuôn đã thoa dầu vào để khuôn nóng. Lấy khuôn ra, cho khoảng 1 muỗng cà phê thịt xay đã ướp lên, dàn mỏng đều. Quậy đều tô bột, múc một vá bột đổ lên trên lớp nhân thịt, tráng đều và mỏng. Múc một muỗng trứng gà đã đánh rưới lên mặt bột. Đặt khuôn trở lại nồi hấp, đậy nắp và hấp khoảng 2 phút. Lấy bánh ra, để nguội bớt rồi dùng dụng cụ lấy bánh ra khỏi khuôn một cách nhẹ nhàng. Tiếp tục lặp lại quy trình cho đến khi hết bột và nhân.	10	/culinary-blog/recipes/fcb19486-2256-5ad6-a6a9-729b29adcbae/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
73d56ef2-920d-43d0-8676-4da8ade2307c	fcb19486-2256-5ad6-a6a9-729b29adcbae	5	Thành phẩm	Sau khi hấp xong các mẻ bánh, bạn nhẹ nhàng xếp bánh ra dĩa. Rắc thêm hành phi giòn rụm và hành lá thái nhỏ lên trên để trang trí cho món ăn thêm phần hấp dẫn. Nếu muốn, bạn có thể cắt bánh thành miếng vừa ăn. Cuối cùng, chan nước sốt chấm đã pha lên bánh và thưởng thức ngay khi còn nóng. Món bánh cuốn Quảng Đông mềm mại, thơm ngon đã sẵn sàng để bạn chiêu đãi cả nhà!	8	/culinary-blog/recipes/fcb19486-2256-5ad6-a6a9-729b29adcbae/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2e0f1922-fe5e-4f7a-b296-f663e7cfb379	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	1	Trộn bột bánh xèo	Cho vào tô 500gr bột bánh xèo cốt dừa, 100ml bia, 1 muỗng cà phê muối, 1/3 muỗng cà phê bột nghệ, 1/2 muỗng cà phê bột ngọt, 2 quả trứng gà, 50gr hành lá cắt nhỏ, 450ml nước lọc. Khuấy đều hỗn hợp đến khi bột tan hoàn toàn.	20	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9f36b4e5-f412-4fc6-a200-18170d8792dc	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	2	Chuẩn bị nhân bánh xèo	Đầu tiên, bạn rửa sạch tôm, lột vỏ và bỏ chỉ đen. Sau đó, lột vỏ hành tây rồi thái sợi. Đem 50gr nấm hương đi ngâm mềm, rửa lại với nước sạch rồi cắt nhỏ. Kế đến, lột vỏ tỏi và hành tím, rửa sơ rồi băm nhỏ. Cà rốt gọt vỏ, rửa sạch rồi bào sợi, chừa lại 1 ít để cắt khoanh nhỏ làm nước mắm.	10	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
517a4d73-9975-4bac-a793-161162277900	9cf5ba46-1b6e-4925-991c-8f2ed99ecf47	1	Sơ chế gà và lá chanh	Rửa sạch gà bằng nước muối loãng, lá chanh thái chỉ mỏng.	5	/culinary-blog/categories/mon-khai-vi.jpg	2026-11-20 10:40:31.503473+00	\N	f	\\x2f9a5e0c5265f2499033ea7146e70b83
af2b59d8-08ce-4609-b637-6b85ef50f93d	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	3	Xào nhân bánh xèo	Bắc chảo lên bếp, cho vào chảo 1 ít dầu ăn rồi cho hành tím băm vào phi thơm. Khi hành thơm, bạn cho tôm, thịt vào chảo cùng 1/2 muỗng cà phê tiêu, 1/2 muỗng cà phê bột ngọt, 1/3 muỗng cà phê muối, 1 muỗng cà phê nước mắm. Xào đều nhân với lửa vừa đến khi chín hoàn toàn. Kế đến, cho vào chảo hành tây, cà rốt, nấm hương và tiếp tục xào đến khi rau củ chín.	6	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
71309d3e-9f9b-487b-b68d-bd9ed72c1fd3	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	4	Đổ bánh xèo	Bắc chảo mới lên bếp, cho vào 1 ít dầu ăn và làm nóng. Khi dầu nóng, bạn cho vào 1 ít hỗn hợp bột bánh rồi tráng thật đều. Kế đến, cho nhân lên trên lớp bột bánh, dàn đều phần nhân và cho 1 ít giá lên mặt bánh rồi gấp đôi bánh lại. Chiên bánh với lửa nhỏ đến khi 2 mặt vàng giòn.	5	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
16881a96-1774-4435-bd8c-832a1950bf8b	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	5	Làm nước chấm bánh xèo	Cho vào tô 3 muỗng canh nước mắm, 6 muỗng canh nước lọc, 1/4 muỗng cà phê bột ngọt, 5 muỗng cà phê đường, nước cốt của 2 quả chanh, 2 muỗng cà phê giấm, 1 ít tiêu, cà rốt cắt khoanh, 1 ít tỏi, ớt băm. Khuấy đều hỗn hợp đến khi đường tan là hoàn tất. Bạn có thể nêm nếm lại hoặc thêm ớt cho phù hợp với khẩu vị gia đình.	5	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
794d664a-02fa-4d2c-bc70-408869658235	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	6	Thành phẩm	Bánh xèo miền Bắc với nấm hương có lớp vỏ giòn rụm, thơm nhẹ ăn kèm cùng nhân tôm thịt bùi béo và rau củ ngọt thanh, chấm với nước mắm chua ngọt, cay cay, siêu ngon miệng.	5	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
458eb1b5-aabc-41fe-bf75-75ad499ee6f9	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	7	Sơ chế nguyên liệu	Trước tiên, rửa sạch tôm, bóc vỏ, bỏ chỉ đen rồi ướp với 1/2 muỗng cà phê muối, 1 muỗng cà phê hạt nêm, 1 muỗng cà phê tiêu, 1 muỗng cà phê đường. Còn thịt thì bạn rửa sạch, cắt mỏng rồi ướp cùng 1/2 muỗng cà phê muối, 1 muỗng cà phê hạt nêm, 1 muỗng cà phê tiêu. Rửa sạch ớt và 2 tép tỏi đã bóc vỏ sau đó băm nhuyễn. Hành tím đem bóc vỏ, rửa sạch rồi băm nhỏ. Bạn rửa sạch hành lá sau đó cắt nhỏ, còn giá và rau sống ăn kèm thì bạn nhặt bỏ phần hư hoặc dập nát, sau đó rửa sạch rồi để ra rổ cho ráo nước.	5	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/steps/7.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
88cb303c-e564-4788-9010-ddd689159af4	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	8	Pha bột	Cho vào tô 500gr bột bánh xèo cùng 100g bột chiên giòn. Sau đó cho vào tô bột 1/2 muỗng cà phê bột nghệ, phần hành lá cắt nhỏ, 500ml nước lọc, 500ml bia, 100ml nước cốt dừa rồi khuấy đều cho bột tan. Bạn để cho bột nghỉ trong 1 giờ.	5	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/steps/8.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
514fff75-ffea-4d45-b515-b47a3c835011	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	9	Pha nước mắm	Cho vào chén phần tỏi ớt đã băm nhuyễn cùng 2 muỗng canh đường, 2 muỗng canh nước mắm, 2 muỗng canh nước cốt chanh, 2 muỗng canh nước lọc rồi dùng muỗng trộn đều cho nước mắm hòa tan. Bạn có thể nêm nếm lại nước mắm cho phù hợp với khẩu vị gia đình.	5	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/steps/9.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
602d2822-f64c-456d-92fa-0b40d3a277ac	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	10	Xào nguyên liệu	Bắc chảo lên bếp, cho 2 muỗng canh dầu ăn vào chảo. Khi dầu nóng lên, cho hành tím băm nhỏ vào phi thơm rồi cho tôm đã ướp vào xào chín. Sau khi tôm chín, bạn cho ra tô rồi tiếp tục xào thịt tương tự như vậy.	5	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/steps/10.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c5d1093d-f1d7-4785-95c9-e727c98b9f38	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	11	Đổ bánh xèo	Bắc một cái chảo chống dính lên bếp. Quét 1 lớp dầu mỏng, sau khi chảo nóng thì đổ 1 lớp bột thật mỏng, láng đều bột khắp mặt chảo. Tiếp đến, bạn cho thêm tôm, thịt đã xào chín và giá vừa đủ vào. Để lửa vừa và đợi cho vỏ bánh bắt đầu chín vàng thì gập đôi bánh lại. Quét thêm ít dầu ăn rồi chiên kĩ 2 mặt để bánh vàng giòn.	5	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/steps/11.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
029f8d2c-9261-4e8a-b22b-3add62e13db8	3bbbcc86-91fd-5ca5-8764-5cecc511ff41	12	Thành phẩm	Món bánh xèo miền Bắc với màu vàng mướt mắt, hương thơm hấp dẫn đã hoàn thành. Lớp vỏ giòn rụm cùng phần nhân thơm ngon chắc chắn sẽ khiến bạn thích mê. Bạn có thể ăn kèm với rau xà lách, cải xanh và rau thơm cho món ăn thơm ngon và đỡ ngấy.	5	/culinary-blog/recipes/3bbbcc86-91fd-5ca5-8764-5cecc511ff41/steps/12.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
33dba71d-0e5d-4551-9613-9b586b8ebe51	9622b506-a920-5848-a276-56f99355fc69	1	Sơ chế và thái mỏng bắp bò	Để thái thịt bò mỏng và đẹp mắt hơn, bạn nên cho miếng bắp bò vào ngăn đông tủ lạnh khoảng 30 - 45 phút cho đến khi thịt đông được khoảng 80%. Sau đó, lấy ra và dùng dao sắc thái thịt thành những lát thật mỏng. Miếng thịt bò nhúng mẻ sẽ mềm và ngon hơn khi thái mỏng.	20	/culinary-blog/recipes/9622b506-a920-5848-a276-56f99355fc69/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
86ee0eaf-a412-4a27-b81e-694732d34c5e	9622b506-a920-5848-a276-56f99355fc69	2	Pha chế mắm nêm chấm kèm đậm đà	Chuẩn bị một tô sạch, cho chén mắm nêm pha sẵn vào. Thêm khoảng 2 - 3 muỗng cà phê đường tùy theo khẩu vị gia đình bạn. Băm nhỏ 1/2 quả thơm (dứa) và 1 ít tỏi ớt băm, sau đó cho tất cả vào tô mắm nêm. Vắt thêm 1/2 quả chanh để tạo vị chua thanh. Khuấy đều cho các gia vị tan hết và hòa quyện vào nhau, tạo nên chén nước chấm thơm lừng, đậm đà.	10	/culinary-blog/recipes/9622b506-a920-5848-a276-56f99355fc69/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8af7ae5d-ae96-477d-97eb-2ed9d167a08f	9622b506-a920-5848-a276-56f99355fc69	3	Nấu hỗn hợp gia vị	Sơ chế 3 nhánh sả: 1 nhánh băm nhỏ, 2 nhánh còn lại đập dập và cắt khúc. Bóc vỏ, rửa sạch 1 củ hành tây và 1 củ hành tím, sau đó cắt khoanh lớn. Ớt cắt khoanh. Bắc một chiếc chảo lên bếp, cho một ít dầu ăn vào đun nóng. Phi thơm sả băm, tỏi băm và ớt khoanh cho dậy mùi. Nêm vào chảo 2 muỗng canh nước mắm, 2 muỗng canh đường, 1/3 muỗng canh hạt nêm, 1/3 muỗng canh bột ngọt, 1/3 muỗng canh muối. Tiếp đến, cho khoảng 1 chén nước lọc vào, đun sôi nhẹ để các gia vị hòa quyện.	6	/culinary-blog/recipes/9622b506-a920-5848-a276-56f99355fc69/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
79175699-5084-4adb-b47c-f1c0b844f1c5	9cf5ba46-1b6e-4925-991c-8f2ed99ecf47	2	Tẩm ướp gia vị	Ướp gà với muối, tiêu và một nửa lá chanh trong 15 phút.	15	/culinary-blog/categories/mon-khai-vi.jpg	2026-11-20 10:40:31.503473+00	\N	f	\\x923e5a8c5bae054cb92ae88802353455
d65e86a4-0cb5-42da-9c69-22fd73563af2	9622b506-a920-5848-a276-56f99355fc69	4	Pha nấu nước nhúng mẻ chua thanh	Trong một chiếc nồi khác, đổ khoảng 1 - 2 lít nước lọc (hoặc nước dừa để tăng thêm độ ngọt tự nhiên) vào nồi. Cho hành tây, hành tím cắt khoanh và sả cắt khúc vào. Tiếp theo, đổ hỗn hợp gia vị vừa nấu vào nồi và đun sôi. Khi nước đã sôi bùng, cho cơm mẻ vào một chiếc rây. Nhúng rây vào nồi và dùng muỗng tán đều để lấy phần nước cốt chua. Bỏ đi phần bã mẻ. Nêm nếm lại nước dùng cho hợp khẩu vị gia đình, đảm bảo vị chua thanh đặc trưng của món bắp bò nhúng mẻ.	5	/culinary-blog/recipes/9622b506-a920-5848-a276-56f99355fc69/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9aa00fe0-c682-4df4-bac4-9271bc6c9b25	9622b506-a920-5848-a276-56f99355fc69	5	Thành phẩm	Đặt nồi nước dùng mẻ lên bếp ga mini hoặc bếp điện giữa bàn ăn. Khi nước sôi bùng, bạn nhúng từng lát bắp bò đã thái mỏng vào cho vừa chín tới. Thịt bò chín nhanh sẽ giữ được độ mềm ngọt tự nhiên. Cuốn thịt bò cùng bánh tráng, các loại rau sống tươi ngon (xà lách, dưa leo, thơm, rau thơm các loại) và chấm một chút mắm nêm đậm đà đã pha sẵn. Món lẩu bắp bò nhúng mẻ chua thanh này có thể ăn kèm bún tươi như một món lẩu truyền thống hoặc cuốn bánh tráng đều ngon tuyệt. Đây chắc chắn sẽ là món nhậu lý tưởng cho những buổi tụ họp.	5	/culinary-blog/recipes/9622b506-a920-5848-a276-56f99355fc69/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
dd7dc0bc-c5be-4a47-be6f-23aab8e5cf67	1ee41201-7d04-589a-9705-08cef1ff4ce3	1	Sơ chế thịt bò	Đầu tiên, thịt bò mua về bạn đem rửa sơ với nước. Kế đến, dùng khăn ẩm sạch lau sơ trên bề mặt để sạch hết các bụi bẩn còn bám lại. Sau đó, dùng dao thái theo thớ ngang thành các lát mỏng vừa ăn.	20	/culinary-blog/recipes/1ee41201-7d04-589a-9705-08cef1ff4ce3/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
52c71e4e-dbbd-4856-8f5f-74a4e16912c5	1ee41201-7d04-589a-9705-08cef1ff4ce3	2	Sơ chế các nguyên liệu khác	Thơm mua về bạn gọt vỏ, đồng thời loại khứa bỏ sạch mắt thơm, sau đó rửa sơ với nước cho sạch, để ráo, rồi dùng dao cắt làm 2 phần, 1 phần cắt lát mỏng, 1 phần băm nhuyễn. Sả thì bạn cắt gốc, rứa sạch rồi đập dập, cắt khúc. Tỏi, hành tím bạn lột vỏ, ớt hiểm bỏ cuống rồi đem băm nhuyễn cả tỏi, hành tím và ớt. Hành tây bạn lột bỏ vỏ, 1 nửa cắt lát mỏng, 1 nửa cắt múi cau. Phần hành tây cắt mỏng bạn cho vào dĩa thịt bò, trộn đều.	10	/culinary-blog/recipes/1ee41201-7d04-589a-9705-08cef1ff4ce3/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7b44ff35-9fef-483c-af36-f1cffe14f755	1ee41201-7d04-589a-9705-08cef1ff4ce3	3	Nấu nước dấm nhúng bò	Chuẩn bị nguyên liệu xong, bạn bắc nồi lên bếp cùng 2 muỗng canh dầu ăn với lửa vừa. Dầu sôi lăn tăn sôi bạn cho phần sả đập dập vào phi thơm. Kế đến, bạn cho phần tỏi, hành tím và ớt hiểm băm nhuyễn vào, tiếp tục dùng đũa xào đều thêm 2 phút. Sau đó, bạn thêm 1.5 lít nước dừa, 100ml giấm, 30gr đường phèn, hành tây cắt múi cau vào, dùng vá đảo đều rồi nấu khoảng 5 phút. Tiếp đó bạn nêm nếm gia vị vừa ăn nữa là nhúng thịt bò vào và thưởng thức thôi!	6	/culinary-blog/recipes/1ee41201-7d04-589a-9705-08cef1ff4ce3/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b2e5588b-a6cf-416c-9202-bd34eec45e5f	1ee41201-7d04-589a-9705-08cef1ff4ce3	4	Pha nước chấm	Bạn lấy chén rồi cho phần thơm băm nhuyễn, 4 muỗng canh mắm nêm, 2 muỗng canh đường, dùng muỗng trộn đều để tất cả được hòa lẫn với nhau.	5	/culinary-blog/recipes/1ee41201-7d04-589a-9705-08cef1ff4ce3/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
2567bd8e-a122-4c32-ada7-a13b3b316616	1ee41201-7d04-589a-9705-08cef1ff4ce3	5	Thành phẩm	Lẩu bò nhúng giấm quả là món ăn vừa thơm ngon lại bổ dưỡng mà không thể chê vào đâu được các bạn nhỉ? Chỉ với vài bước đơn giản, thế là bạn đã có thể thưởng thức được từng miếng bò dai mềm nhúng với phần nước mặn mà, chua ngọt dịu nhẹ hấp dẫn vô cùng! Đặc biệt, lẩu bò nhúng dấm (giấm) còn có thể ăn cùng bún tươi, hoặc cuốn với bánh tráng và rau sống nữa đó nha! Chắc chắn phải chấm kèm với chén mắm nêm để món lẩu thêm tròn vị nữa đấy!	5	/culinary-blog/recipes/1ee41201-7d04-589a-9705-08cef1ff4ce3/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
89d041e8-cff6-44ba-b42a-4d85f32ba2cc	18c4049d-bbdd-5c84-8bb4-8574700a9491	1	Sơ chế xương và ninh nước dùng lẩu	Đầu tiên, các bạn cho xương cục vào nồi nước sôi, chần sơ khoảng 1-2 phút để loại bỏ bọt bẩn và máu trong xương. Điều này giúp nước dùng trong và không bị đục. Sau khi chần, rửa sạch xương dưới vòi nước lạnh. Cho xương đã rửa sạch vào nồi khoảng 2-2.5 lít nước. Đặt lên bếp và ninh trong khoảng 30 phút đến 1 tiếng đồng hồ. Lưu ý, ở bước này chúng ta chưa nêm bất kỳ gia vị nào vào nước dùng nhé.	75	/culinary-blog/recipes/18c4049d-bbdd-5c84-8bb4-8574700a9491/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3f681932-9c3b-4491-b9a1-6cac74d20757	18c4049d-bbdd-5c84-8bb4-8574700a9491	2	Sơ chế cá quả và các nguyên liệu khác	Cá quả sau khi làm sạch, các bạn cắt thành từng khúc dày khoảng 3cm. Rửa lại cá với nước sạch. Sả đập dập và băm nhỏ. Hành khô đập dập, băm nhỏ. Cà chua bổ múi cau. Rau ăn kèm như ngô, rau cải, rau thì là thái nhỏ khoảng 1.5-2cm.	37	/culinary-blog/recipes/18c4049d-bbdd-5c84-8bb4-8574700a9491/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b75c52ac-f01e-4a2b-870d-77268146f673	18c4049d-bbdd-5c84-8bb4-8574700a9491	3	Chuẩn bị rau ăn kèm và trình bày	Xếp rau cải, rau thì là đã thái vào đĩa. Sau đó, đặt các khúc cá quả lên trên.	25	/culinary-blog/recipes/18c4049d-bbdd-5c84-8bb4-8574700a9491/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
304aa37b-3413-4888-bc67-a50541b26a48	18c4049d-bbdd-5c84-8bb4-8574700a9491	4	Phi thơm gia vị cho nước lẩu chua cay	Cho một chút dầu ăn vào chảo, đun nóng rồi cho hành khô băm vào phi thơm vàng. Khi hành đã thơm, cho sả băm vào phi chung cho đến khi tất cả vàng đều và dậy mùi thơm. Tiếp theo, cho cà chua bổ múi cau và 1 trái ớt vào đảo đều. Cuối cùng, cho 3 thìa canh cơm mẻ vào đảo chung. Nếu cơm mẻ của bạn chưa ngấu, hãy xay nhuyễn trước khi cho vào nhé. Đảo đều cho đến khi mùi mẻ thơm lừng thì tắt bếp.	18	/culinary-blog/recipes/18c4049d-bbdd-5c84-8bb4-8574700a9491/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
54bbab37-c7ff-41fd-b329-6a4f7691eb74	dd6da83f-f56b-5b05-9907-30a6eccf87da	4	Cách làm chè tàu hủ bằng đường nho	Pha khoảng 1/6 muỗng cà phê đường nho với một chút nước vào thố, tráng đều đáy và thành thố. Lưu ý chỉ pha đường nho khi sữa đậu đã nấu xong và để nguội bớt xuống khoảng 80 độ C. Đổ dứt khoát nước sữa đậu nành vào thố đường nho, hớt bỏ bọt trên bề mặt. Đậy một chiếc khăn sạch lên miệng thố rồi mới đậy nắp để tránh nước đọng nhỏ xuống làm rỗ mặt. Để yên 40 phút cho đậu đông lại.	15	/culinary-blog/recipes/dd6da83f-f56b-5b05-9907-30a6eccf87da/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ace86c47-2ebd-49bc-a6dd-bcc16ac74c54	18c4049d-bbdd-5c84-8bb4-8574700a9491	5	Hoàn thiện nước lẩu cá quả đậm đà	Trút phần gia vị đã phi thơm ở Bước 4 vào nồi nước xương đang ninh. Nêm nếm gia vị: Thêm 3 muỗng cà phê bột nêm, 1/2 muỗng cà phê muối và 1/2 muỗng cà phê bột ngọt. Khuấy đều và nếm thử. Tùy theo khẩu vị gia đình, bạn có thể điều chỉnh độ mặn, ngọt. Nếu muốn ăn cay, thêm sa tế hoặc tương ớt. Để nước lẩu có màu vàng đẹp mắt, bạn có thể cho thêm 1/2 củ nghệ nhỏ đập dập hoặc 1/2 muỗng cà phê bột nghệ. Nước lẩu cá quả sau khi hoàn thiện sẽ có vị ngọt thanh từ xương, chua dịu của mẻ, thơm lừng mùi hành sả và chút cay nhẹ, rất hấp dẫn.	15	/culinary-blog/recipes/18c4049d-bbdd-5c84-8bb4-8574700a9491/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e30a5773-ba2b-44fb-b6c2-e09adc3cc167	18c4049d-bbdd-5c84-8bb4-8574700a9491	6	Thành phẩm	Bây giờ, bạn chỉ cần đặt nồi lẩu lên bếp từ hoặc nồi lẩu điện, đun sôi và bắt đầu nhúng cá, rau cùng các nguyên liệu ăn kèm. Khi ăn, nhúng từng miếng cá quả chắc thịt, chấm kèm nước mắm ớt và thưởng thức cùng rau cải hơi đắng nhẹ, ngô ngọt. Món lẩu cá quả rau cải này sẽ làm ấm lòng cả gia đình bạn.	12	/culinary-blog/recipes/18c4049d-bbdd-5c84-8bb4-8574700a9491/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a0b99b6a-a698-4a42-a89e-b63df5c98577	1901526a-0fcb-5c30-905d-78addcd96622	1	Lọc cua đồng lấy nước cốt riêu cua đậm đà	Với 1.5-2kg cua đồng đã xay sẵn, bạn cho vào một bát lớn, đổ nước vào và dùng tay bóp đều để phần thịt cua tách khỏi xương. Để lắng một chút, sau đó nghiêng bát chắt lấy phần nước thịt cua cho vào nồi. Lặp lại quá trình này 2-3 lần cho đến khi phần bã cua trắng, không còn thịt.	45	/culinary-blog/recipes/1901526a-0fcb-5c30-905d-78addcd96622/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3c161519-68ca-4e10-974a-89bbd68e6da3	1901526a-0fcb-5c30-905d-78addcd96622	2	Sơ chế cà chua, hành khô và hành lá	Cà chua rửa sạch, bổ múi cau, bỏ phần núm. Hành khô bóc vỏ, thái lát mỏng. Hành lá rửa sạch, cắt khúc dài khoảng 2cm. Các nguyên liệu này sẽ giúp món lẩu riêu cua bắp bò sườn sụn của bạn thêm phần hấp dẫn.	22	/culinary-blog/recipes/1901526a-0fcb-5c30-905d-78addcd96622/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1c408a22-3f4c-4578-8774-30aaa8bc7906	1901526a-0fcb-5c30-905d-78addcd96622	3	Nấu nước dùng lẩu riêu cua và vớt riêu cua	Cho phần nước cốt cua đã lọc vào nồi, nêm 1 muỗng cà phê bột ngọt và 1 muỗng cà phê bột canh để nước dùng và riêu cua được đậm vị. Khuấy đều theo một chiều để thịt cua cuộn xoáy vào nhau. Bật bếp ở lửa vừa (ví dụ: mức 5/8 trên bếp từ). Khi nước nóng và gần sôi, thịt cua sẽ bắt đầu nổi lên và đóng thành từng bánh. Lúc này, hạ nhỏ lửa (ví dụ: mức 2/8) để tránh riêu bị bung trào. Khi nước sôi bùng, hạ lửa nhỏ nhất (mức 1/8), đậy nắp nấu thêm 2 phút cho riêu chín. Sau đó, tắt bếp và vớt toàn bộ phần bánh riêu cua ra bát riêng.	15	/culinary-blog/recipes/1901526a-0fcb-5c30-905d-78addcd96622/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f24bf8b6-e40e-4bc9-80fe-39407e4a2d38	1901526a-0fcb-5c30-905d-78addcd96622	4	Xào cà chua tạo màu cho nước lẩu	Đặt chảo lên bếp, cho 2 muỗng canh mỡ gà vào đun nóng. Khi dầu nóng, cho một nửa số hành khô đã thái lát vào phi thơm vàng. Tiếp đến, trút toàn bộ cà chua vào xào ở lửa lớn khoảng 20 giây cho cà chua thấm dầu. Cuối cùng, cho hành lá vào đảo nhanh rồi tắt bếp. Đổ phần cà chua xào này vào nồi nước dùng lẩu riêu cua.	11	/culinary-blog/recipes/1901526a-0fcb-5c30-905d-78addcd96622/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1c47c84c-51be-4d19-98bf-61bc628823b3	1901526a-0fcb-5c30-905d-78addcd96622	5	Chưng gạch cua và làm nước chấm lẩu riêu cua đặc biệt	Sử dụng chảo vừa xào cà chua, cho 2 muỗng canh mỡ gà (hoặc dầu ăn) vào. Nếu muốn gạch cua có màu vàng đậm hơn, bạn có thể thêm 2 muỗng canh dầu màu điều. Phi thơm phần hành khô còn lại. Khi hành vàng thơm, hạ lửa nhỏ nhất, cho phần gạch cua vào chưng khoảng hơn 1 phút cho gạch chín và lên màu đẹp mắt. Tắt bếp, chia gạch cua chưng làm hai phần. Một nửa cho vào nồi nước dùng để tạo màu và hương vị. Nửa còn lại sẽ dùng làm nước chấm: nêm thêm chút bột ngọt, nước mắm, sa tế (nếu ăn cay) và 2 muỗng canh nước cua từ nồi lẩu. Bật bếp lửa nhỏ nấu sôi lại, thêm chút hành phi cho dậy mùi rồi tắt bếp, cho ra bát.	9	/culinary-blog/recipes/1901526a-0fcb-5c30-905d-78addcd96622/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
fcf96575-9c1c-4f98-9493-eca1fc679896	1901526a-0fcb-5c30-905d-78addcd96622	6	Hoàn thiện nồi lẩu riêu cua bắp bò sườn sụn	Bật bếp trở lại với nồi nước dùng lẩu riêu cua. Nêm nếm gia vị với bột canh, bột ngọt và đặc biệt là dấm bỗng để tạo vị chua thanh đặc trưng. Với 8 lít nước dùng, bạn có thể dùng khoảng 8 thìa canh dấm bỗng, tùy chỉnh theo khẩu vị. Đợi nước lẩu sôi, chuyển sang nồi lẩu chuyên dụng. Cho đậu phụ, tóp mỡ, hành phi, và một ít gạch cua chưng vào nồi lẩu.	7	/culinary-blog/recipes/1901526a-0fcb-5c30-905d-78addcd96622/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
591b2c5b-f226-46b4-b37e-a0274d60be93	1901526a-0fcb-5c30-905d-78addcd96622	7	Thành phẩm	Giờ thì bạn đã có một nồi lẩu riêu cua bắp bò sườn sụn thơm lừng, nóng hổi sẵn sàng để thưởng thức! Dọn kèm các loại thịt bò (bắp bò, diềm thăn giòn, sườn sụn non, ba chỉ bò Mỹ), đậu phụ, váng đậu, các loại nấm, rau nhúng và bún tươi. Món lẩu này chắc chắn sẽ làm hài lòng mọi thành viên trong gia đình và bạn bè.	6	/culinary-blog/recipes/1901526a-0fcb-5c30-905d-78addcd96622/steps/7.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
498efa3b-f5c0-426e-bc94-c2aef2c3a332	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	1	Sơ chế và ướp rau ăn kèm	Rửa 100gr bắp cải tím đã thái nhỏ qua nước muối pha loãng, sau đó rửa lại bằng nước sạch và để ráo. Cho bắp cải vào tô, ướp với 1/4 thìa cà phê muối, 2 thìa cà phê đường và 1/2 thìa canh giấm táo. Trộn đều và để khoảng 10 phút cho bắp cải xèo xuống, sau đó vắt ráo nước. Dưa leo, cà chua rửa sạch, thái lát mỏng. Rau xà lách rửa sạch, để ráo. Đây là những nguyên liệu làm hamburger chay không thể thiếu.	45	/culinary-blog/recipes/e1721eed-2286-5a6b-9dc3-63a6cb98ecc1/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9cc129ef-5c83-4004-9ea1-289d5d221187	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	2	Làm sốt hamburger chay béo ngậy	Đun sôi nồi nước có pha chút muối loãng, cho 100gr đậu hũ non vào luộc khoảng 3 phút rồi vớt ra. Cho đậu hũ non đã luộc vào máy xay. Thêm 2 thìa canh tương ớt, 1/2 thìa cà phê muối, 1/2 thìa canh đường và 1 thìa canh dầu ăn. Xay mịn hỗn hợp cho đến khi sốt sánh, mịn màng. Vậy là bạn đã có phần sốt chay rất béo thơm và giàu dinh dưỡng cho món bánh burger chay.	22	/culinary-blog/recipes/e1721eed-2286-5a6b-9dc3-63a6cb98ecc1/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
971f1154-30bf-49d0-a791-7059125e15dd	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	3	Chế biến thịt hamburger chay thơm lừng	200gr khoai môn cao gọt vỏ, thái nhỏ. Hấp chín khoai môn trong khoảng 15 phút tính từ lúc nước sôi. Cho khoai môn đã hấp chín vào máy xay. Thêm 100gr cọng tàu hủ ky non, 1 miếng lá sườn chay đã ngâm mềm, 1 đoạn gốc boa rô. Nêm gia vị: 1/2 thìa cà phê muối, 1 thìa canh hạt nêm chay, 1/2 thìa canh đường, 1 thìa cà phê tiêu và 1 thìa canh bột mì đa dụng để tạo độ kết dính cho ham. Xay mịn hỗn hợp cho đến khi dẻo quánh. Sau đó, tạo hình hỗn hợp thành 4 miếng ham tròn, dẹt, có độ dày vừa phải. Đây là cách làm patty chay đơn giản. Làm nóng chảo với 2 thìa canh dầu ăn. Cho từng miếng ham vào chiên với lửa nhỏ cho vàng đều hai mặt, có chút giòn nhẹ bên ngoài.	15	/culinary-blog/recipes/e1721eed-2286-5a6b-9dc3-63a6cb98ecc1/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
81653f61-93be-4020-863f-5a9801cab899	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	4	Hoàn thành món hamburger chay hấp dẫn	Chẻ đôi bánh mì hamburger. Phết đều một lượng sốt chay vừa đủ lên mặt trong của nửa bánh trên. Đặt lá xà lách, lát cà chua, dưa leo xen kẽ lên nửa bánh dưới. Tiếp tục phết thêm một ít sốt lên rau củ để tăng hương vị đậm đà. Đặt miếng ham chiên lên trên cùng. Úp nửa bánh mì đã phết sốt lên trên để hoàn thành chiếc hamburger chay.	11	/culinary-blog/recipes/e1721eed-2286-5a6b-9dc3-63a6cb98ecc1/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
48cb35a6-6f73-44bf-9123-91d5301746a4	e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	5	Thành phẩm	Món hamburger chay thơm ngon, bổ dưỡng đã sẵn sàng để thưởng thức. Với đầy đủ rau củ tươi mát, sốt béo ngậy và ham chiên đậm đà, đây chắc chắn là món ăn chay đốn tim cả người lớn lẫn trẻ nhỏ.	9	/culinary-blog/recipes/e1721eed-2286-5a6b-9dc3-63a6cb98ecc1/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8219492e-e880-4fce-b2cc-00c206e2bd09	dacd5de8-f548-5e96-9b09-bee5320ee3e8	1	Sơ chế sườn non chay và nấm	Ngâm sườn non chay khô với 1 lít nước cho nở mềm, sau đó rửa sạch và vắt thật ráo nước. Nấm kim châm rửa qua nước muối loãng, cho vào túi nilon dùng chày giã tơi (không giã nhuyễn) để tạo sớ thịt dai ngon cho món ăn. Sườn non cũng mang đi giã nhuyễn bằng tay để giữ được kết cấu sớ thịt tự nhiên.	60	/culinary-blog/recipes/dacd5de8-f548-5e96-9b09-bee5320ee3e8/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b2e6fefa-4363-401c-baf3-4874a0e61fb1	dacd5de8-f548-5e96-9b09-bee5320ee3e8	2	Luộc và quết đậu hũ	Cho đậu hũ trắng vào nồi luộc với 1 muỗng cà phê muối trong 10 đến 15 phút đến khi đậu nổi lên và xuất hiện các lỗ li ti bên trong. Vớt ra để thật nguội, cho vào túi vải vắt kiệt nước rồi dùng chày giã liên tục đến khi đậu hũ dẻo mịn, có độ kết dính cao và hít chặt vào chày.	30	/culinary-blog/recipes/dacd5de8-f548-5e96-9b09-bee5320ee3e8/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a34eab81-ed78-4cbf-8940-66506600c976	dacd5de8-f548-5e96-9b09-bee5320ee3e8	3	Trộn nhân và tạo hình cá kèo chay	Cho sườn non và nấm đã vắt khô vào thau đậu hũ, nêm 1,5 muỗng cà phê hạt nêm chay và 1 muỗng cà phê tiêu xay. Dùng tay nhồi kỹ đến khi hỗn hợp thành một khối dẻo đồng nhất. Lấy một lượng nhân vừa đủ, bóp chặt tay rồi nặn thành hình trụ dài giống như hình dáng con cá kèo.	20	/culinary-blog/recipes/dacd5de8-f548-5e96-9b09-bee5320ee3e8/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
15c95a95-ff84-43c8-8db5-bc313b3ac4da	dacd5de8-f548-5e96-9b09-bee5320ee3e8	4	Cuốn lớp da cá bằng rong biển khô	Hòa tan bột mì với nước để tạo hỗn hợp keo sệt. Cắt rong biển thành các miếng có chiều dài vừa vặn với con cá đã nặn. Phết một lớp bột mì mỏng lên rong biển, đặt nhân vào giữa rồi cuộn chặt lại. Bột mì sẽ giúp lớp rong biển dính chặt vào nhân, không bị bong khi chế biến các món kho chay hay món chiên.	15	/culinary-blog/recipes/dacd5de8-f548-5e96-9b09-bee5320ee3e8/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
cadb27ee-23c9-4fcb-85b2-5550498c40eb	dacd5de8-f548-5e96-9b09-bee5320ee3e8	5	Hấp và định hình	Lót giấy nến vào xửng hấp, xếp cá vào và phủ thêm một lớp giấy nến lên trên để tránh nước nhỏ xuống làm nát rong biển. Hấp cá trong 30 phút ở lửa nhỏ, sau đó để nguội hẳn rồi bọc màng bọc thực phẩm, cho vào ngăn mát tủ lạnh qua đêm để cá định hình chắc chắn và dai ngon hơn.	12	/culinary-blog/recipes/dacd5de8-f548-5e96-9b09-bee5320ee3e8/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c196c3ba-f3d6-437c-8048-2fc605ac0111	dacd5de8-f548-5e96-9b09-bee5320ee3e8	6	Chiên cá kèo chay	Cá kèo chay sau 1 đêm đã dẻo dai, bạn khía nhẹ những đường chéo trên thân cá rồi cho vào chảo dầu nóng, chiên đến khi giòn vàng đều và tỏa mùi thơm hấp dẫn.	10	/culinary-blog/recipes/dacd5de8-f548-5e96-9b09-bee5320ee3e8/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
931a9bf9-53a1-4f93-9446-9ce446f15a04	dacd5de8-f548-5e96-9b09-bee5320ee3e8	7	Thành phẩm	Cá kèo chay sau khi chiên có lớp vỏ rong biển giòn rụm, bên trong nhân dai chắc, đậm đà. Khi ăn, bạn có thể làm món kho chay, hoặc đơn giản cuốn cá với bánh tráng và rau, chấm cùng nước mắm me chua cay cũng rất ngon.	8	/culinary-blog/recipes/dacd5de8-f548-5e96-9b09-bee5320ee3e8/steps/7.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6525399a-ee0f-41e0-988f-ba98506a7376	86312047-fba9-5e2c-a441-f693b2622cce	1	Làm nước chấm (Tentsuyu)	Bạn cho 180ml nước dùng dashi, 3 muỗng canh nước tương, 2 muỗng canh rượu mirin và 2 muỗng cà phê đường vào một chiếc nồi nhỏ. Bạn bật bếp đun sôi, sau đó hạ lửa và đun liu riu cho đến khi đường tan hết rồi tắt bếp, để sang một bên.	45	/culinary-blog/recipes/86312047-fba9-5e2c-a441-f693b2622cce/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
37f653c5-58e1-49e1-b4aa-305a899374f1	86312047-fba9-5e2c-a441-f693b2622cce	2	Sơ chế rau củ	Bạn cắt 1 củ khoai lang thành các lát tròn dày khoảng 6mm, ngâm trong nước 15-30 phút để loại bỏ tinh bột thừa rồi thấm thật khô. Bạn cắt bí đỏ và 5cm ngó sen thành lát dày 6mm (ngâm ngó sen vào chén nước có pha 1 muỗng cà phê giấm trong 5 phút rồi thấm khô). Nấm đùi gà bạn cắt lát mỏng dọc theo thân. Riêng cà tím, ngay trước khi chiên bạn mới cắt đôi theo chiều dọc, khía các đường mỏng khoảng 3mm dọc theo thân (giữ lại phần cuống khoảng 2.5cm) rồi ấn nhẹ để tạo hình rẻ quạt. Lá tía tô bạn rửa sạch và để nguyên lá.	22	/culinary-blog/recipes/86312047-fba9-5e2c-a441-f693b2622cce/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e4a817bf-11b1-4cc5-b1c4-2df10cd3bde1	86312047-fba9-5e2c-a441-f693b2622cce	3	Pha bột tempura	Bạn rây 120gr bột mì vào tô lớn. Trong một tô khác, bạn khuấy mạnh 200ml nước đá lạnh với 1 quả trứng gà rồi hớt bỏ bọt trên bề mặt. Bạn đổ từ từ hỗn hợp trứng nước vào tô bột, dùng đũa khuấy theo hình số 8 trong khoảng 15 - 20 giây. Bạn lưu ý không khuấy quá kỹ, bột vẫn còn những cục vón nhỏ là đạt. Để bột luôn lạnh, bạn có thể thêm 1 - 2 viên đá hoặc đặt tô bột vào một thau nước đá lớn hơn.	15	/culinary-blog/recipes/86312047-fba9-5e2c-a441-f693b2622cce/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f4305a47-a7ce-4588-86ec-32c5d213ca83	86312047-fba9-5e2c-a441-f693b2622cce	4	Chiên rau củ	Bạn cho khoảng 1 lít dầu ăn vào nồi hoặc chảo sâu lòng sao cho dầu cao khoảng 3cm, làm nóng dầu đến 160°C. Để kiểm tra, bạn nhúng đầu đũa gỗ vào, nếu thấy bọt nhỏ li ti sủi quanh đầu đũa là dầu đã đạt yêu cầu. Khi dầu đạt 160°C, bạn nhúng khoai lang và ngó sen vào bột rồi chiên trong 3 - 4 phút đến khi vàng nhạt. Tiếp theo, bạn tăng lửa để nhiệt độ dầu lên khoảng 170 - 180°C, nhúng bí đỏ, cà tím và nấm vào bột rồi chiên trong 1 - 2 phút. Cuối cùng, bạn phủ một ít bột mì khô lên mặt sau lá tía tô, chỉ nhúng mặt sau này vào bột tempura rồi chiên nhanh trong 15-20 giây. Bạn vớt tempura ra khay có giá đỡ hoặc giấy thấm dầu để loại bỏ dầu thừa.	11	/culinary-blog/recipes/86312047-fba9-5e2c-a441-f693b2622cce/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7827aa0a-f0a0-4d26-b4fe-b627f4e14e44	86312047-fba9-5e2c-a441-f693b2622cce	5	Thành phẩm	Món tempura rau củ có lớp vỏ vàng nhạt, giòn tan bao bọc bên ngoài phần rau củ chín mềm, ngọt lịm. Bạn phục vụ món ăn kèm với nước chấm Tentsuyu ấm nóng nhé. Món này giúp bạn thưởng thức rau củ chiên mãi mà không thấy ngán.	9	/culinary-blog/recipes/86312047-fba9-5e2c-a441-f693b2622cce/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
34d423a2-bffd-4092-ab3e-969912c86e0f	25e20399-9bef-56eb-b205-d37f28eb4553	1	Sơ chế nguyên liệu	Mua đậu hũ chiên sẵn về cắt thành khối hình vuông nhỏ vừa ăn. Cà chua rửa sạch, bỏ cuống rồi cắt hình múi cau.	20	/culinary-blog/recipes/25e20399-9bef-56eb-b205-d37f28eb4553/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f29576d6-34f8-4585-9e6d-75e465ad4e6e	25e20399-9bef-56eb-b205-d37f28eb4553	2	Làm đậu hũ sốt cà chua	Bắc chảo lên bếp với 2 muỗng canh dầu ăn đun với lửa lớn. Khi dầu nóng thì cho cà chua vào xào khoảng 5 phút để mềm và tan thành hỗn hợp sền sệt. Sau đó bạn hạ bếp xuống còn lửa nhỏ rồi cho đậu hũ chiên vào đảo đều. Nêm vào 1 muỗng cà phê muối, 1/2 muỗng cà phê bột ngọt, 2 muỗng cà phê hạt nêm chay, đảo đều khoảng 3 phút cho gia vị thấm vào đậu hũ. Nêm nếm gia vị lại cho vừa ăn rồi tắt bếp. Cho đậu hũ sốt cà chua ra dĩa là hoàn thành rồi.	10	/culinary-blog/recipes/25e20399-9bef-56eb-b205-d37f28eb4553/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9708b356-e1be-40b2-9f93-f1266d7dc6d2	25e20399-9bef-56eb-b205-d37f28eb4553	3	Thành phẩm	Món đậu hũ sốt cà chua chay bắt mắt vô cùng với màu vàng nhẹ của đậu hũ và màu đỏ tươi quyến rũ của cà chua. Miếng đậu hũ mềm mịn béo thơm hòa cùng vị chua dịu nhẹ của cà chua chắc chắn sẽ hao cơm lắm đấy!	6	/culinary-blog/recipes/25e20399-9bef-56eb-b205-d37f28eb4553/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e97412b3-8bbb-4e4d-9a99-45cc1e312173	25e20399-9bef-56eb-b205-d37f28eb4553	4	Sơ chế nguyên liệu	Đậu hũ ta sau khi mua về, ban rửa sạch rồi đem đi luộc chín. Sau đó, bạn lấy đậu hũ ra và xắt lát vừa ăn rồi xếp ra dĩa. Nấm đùi gà nhỏ thì cắt bỏ phần chân nấm, ngâm trong nước muối loãng khoảng 3 - 5 phút, rửa lại với nước và để ráo. Cắt lát vừa ăn. Cà chua rửa sạch, cắt hạt lựu.	5	/culinary-blog/recipes/25e20399-9bef-56eb-b205-d37f28eb4553/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
bd07318f-e84b-4167-babd-dca9f9295bf1	25e20399-9bef-56eb-b205-d37f28eb4553	5	Xào nấm	Bắc chảo lên bếp, cho 1 muỗng canh dầu ăn vào chảo, đợi dầu nóng cho 1 muỗng canh hành Boaro vào phi thơm, sau đó cho nấm đùi gà xào. Nêm thêm 1/2 muỗng cà phê hạt nêm chay, 1 muỗng cà phê dầu hào chay, 2 muỗng canh nước, 1 muỗng cà phê nước tương và 1/3 muỗng cà phê bột bắp pha loãng với 1/3 chén nước. Bạn đảo đều tay đến khi nấm thấm đều gia vị thì thêm 1 ít lát ớt.	5	/culinary-blog/recipes/25e20399-9bef-56eb-b205-d37f28eb4553/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
014eaadb-24e6-4458-935f-f4a52e0ec83f	25e20399-9bef-56eb-b205-d37f28eb4553	6	Làm sốt cà chua	Bạn đặt chảo khác lên bếp, phi thơm 1 muỗng canh dầu ăn với 1/2 chén hành lá và cà chua cắt nhỏ. Sau đó, bạn cho lần lượt: 2/3 muỗng canh hạt nêm chay, 2/3 muỗng canh đường, 1 muỗng canh nước mắm chay, 2 muỗng tương cà, 1 muỗng canh bột bắp pha loãng với 50 ml nước vào chảo. Bạn đảo đều và mở lửa lớn để đun sôi hỗn hợp. Khi hỗn hợp sôi, giảm lửa nhỏ lại và đun đến khi nước sốt có độ sệt mong muốn là được.	5	/culinary-blog/recipes/25e20399-9bef-56eb-b205-d37f28eb4553/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
21914279-2ea8-4df8-8259-30dce08663c5	25e20399-9bef-56eb-b205-d37f28eb4553	7	Hoàn thành	Bạn cho đậu hũ ta đã luộc ra dĩa, sau đó cho nấm xào lên rồi rưới thêm sốt cà cà lên trên, thêm 1 ít hành lá và ngò được cắt nhỏ lên trên để trang trí là hoàn thành.	5	/culinary-blog/recipes/25e20399-9bef-56eb-b205-d37f28eb4553/steps/7.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
09e77e59-957e-444a-b5e1-b8d59488bca8	25e20399-9bef-56eb-b205-d37f28eb4553	8	Thành phẩm	Đậu hũ sốt cà chua có màu sắc bắt mắt, hấp dẫn. Đậu hũ ta mềm mịn, beo béo kết hợp với dai mềm sần sật của nấm đùi gà, hoà quyện với nước sốt cà chua đậm đà, ăn cực bắt miệng.	5	/culinary-blog/recipes/25e20399-9bef-56eb-b205-d37f28eb4553/steps/8.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
6d0d8853-1a3f-49d0-b44c-80e7f4f8984c	dd6da83f-f56b-5b05-9907-30a6eccf87da	1	Sơ chế đậu nành và làm trân châu trắng	Đậu nành sau khi mua về bạn rửa sạch rồi ngâm qua đêm từ 6 đến 8 tiếng cho hạt nở mềm. Trong lúc đợi, bạn làm trân châu bằng cách cho nước ấm khoảng 70 đến 80 độ C vào 40 gr bột năng, nhồi đều rồi vò viên nhỏ. Luộc trân châu trong nước sôi đến khi trong veo thì vớt ra để ráo.	60	/culinary-blog/recipes/dd6da83f-f56b-5b05-9907-30a6eccf87da/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
853a5ed0-a365-45c9-be4b-a8914915ac0b	dd6da83f-f56b-5b05-9907-30a6eccf87da	2	Xay đậu nành và lọc sữa	Đậu nành đã ngâm đem đãi sạch vỏ để thành phẩm tào phớ trắng đẹp hơn. Cho đậu vào máy xay cùng khoảng 1 lít nước. Sử dụng túi vải lọc lấy nước cốt đậu nành, nên lọc 1 đến 2 lần để đảm bảo nước đậu thật mịn, không còn bã, giúp tàu hủ mịn màng hơn.	30	/culinary-blog/recipes/dd6da83f-f56b-5b05-9907-30a6eccf87da/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c334bd7c-2e1d-464f-9821-bf8b2331616b	dd6da83f-f56b-5b05-9907-30a6eccf87da	3	Nấu sữa đậu nành và pha bột gạo	Cho nước đậu nành vào nồi cùng vài lá dứa để tạo mùi thơm, đun sôi và thường xuyên hớt bọt. Sau 5 phút, vớt lá dứa ra để tránh bị đắng. Pha 3 muỗng canh bột gạo với 3 muỗng canh nước, khuấy tan rồi đổ từ từ vào nồi sữa đậu. Tiếp tục nấu thêm khoảng 20 phút trên lửa nhỏ, vừa nấu vừa khuấy đều tay để không bị dính đáy nồi.	20	/culinary-blog/recipes/dd6da83f-f56b-5b05-9907-30a6eccf87da/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
78fc9886-ac6b-425a-8f7c-9c001a0c4dfa	7111f1ae-df61-4e09-8bbd-f37fc54e3ebd	1	Step 1	Description 1	5	/culinary-blog/categories/mon-khai-vi.jpg	2026-11-20 10:47:03.155095+00	\N	f	\\xd5bf079bedf22b49bfc6a9123baf9e13
481f380f-586f-49b4-86ec-b903cd5f27ce	dd6da83f-f56b-5b05-9907-30a6eccf87da	5	Nấu nước đường gừng	Cho 150 gr đường thốt nốt vào nồi cùng một ít nước, nấu đến khi đường tan và chuyển màu vàng đẹp. Thêm gừng thái sợi và phần trân châu đã luộc chín vào nấu cùng cho đến khi nước đường hơi sánh lại thì tắt bếp.	12	/culinary-blog/recipes/dd6da83f-f56b-5b05-9907-30a6eccf87da/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a7827dbd-40a5-4873-9548-840628913b68	dd6da83f-f56b-5b05-9907-30a6eccf87da	6	Thành phẩm	Món chè tàu hủ sau khi hoàn thành có màu trắng ngần, kết cấu mềm dẻo, sánh mịn nhờ sự kết hợp của bột gạo và đường nho. Khi ăn, bạn múc từng lát tàu hủ mỏng vào chén, thêm nước đường gừng cay nồng và trân châu dai giòn, có thể thêm chút nước cốt dừa để tăng độ béo ngậy.	10	/culinary-blog/recipes/dd6da83f-f56b-5b05-9907-30a6eccf87da/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
763bb65e-9521-48dc-8846-4b6f447bf226	44719da2-3815-5f03-9ea6-9b4b6597fdd0	1	Làm hạt lựu từ bột năng	Trộn 300 gr bột năng với 250 ml nước, lọc qua hộp có lót giấy và vải mùng để rút bớt nước trong 30 phút. Xay củ dền lấy nước cốt rồi đổ lên bề mặt bột đã khô, phủ thêm một lớp bột năng khô để chống dính. Cắt bột thành từng miếng nhỏ hình hạt lựu, sau đó sàng bỏ bột thừa.	60	/culinary-blog/recipes/44719da2-3815-5f03-9ea6-9b4b6597fdd0/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
1cdf03a4-0768-4c04-ab61-b90b8b829aa1	44719da2-3815-5f03-9ea6-9b4b6597fdd0	2	Luộc hạt lựu	Đun sôi nước, thả hạt lựu vào luộc khoảng 5 phút cho đến khi hạt nổi lên và trong suốt. Vớt ra ngâm ngay vào nước lạnh, rửa sạch 2-3 lần rồi trộn với 3 muỗng canh đường để hạt bóng và giòn.	30	/culinary-blog/recipes/44719da2-3815-5f03-9ea6-9b4b6597fdd0/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7143329f-c13a-4ade-90c8-1ea3cef66b0e	44719da2-3815-5f03-9ea6-9b4b6597fdd0	3	Nấu sương sâm	Bạn vò 100 gr lá sâm cùng 1 lít nước lọc. Sau khi vò nát lá sâm, bạn lọc qua rây để loại bỏ vụn lá. Sau đó để hỗn hợp sương sâm đông trong 1-2 tiếng.	20	/culinary-blog/recipes/44719da2-3815-5f03-9ea6-9b4b6597fdd0/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a5ce5552-e865-4494-ae1a-069f3c3bb99c	44719da2-3815-5f03-9ea6-9b4b6597fdd0	4	Nấu sương sáo	Đối với sương sáo, bạn trộn 50 gr bột sương sáo với 100 gr đường cát, sau đó thêm 1 lít nước và khuấy đều. Vừa đun vừa khuấy hỗn hợp ở lửa nhỏ đến khi thấy hỗn hợp đặc và đen bóng, cho sương sáo ra khay và để vào tủ lạnh cho sương sáo đông trong 2 tiếng.	15	/culinary-blog/recipes/44719da2-3815-5f03-9ea6-9b4b6597fdd0/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
04b65cc3-241f-4bc9-a906-8de11ed74f8d	44719da2-3815-5f03-9ea6-9b4b6597fdd0	5	Nấu xoa xoa	Để nấu xoa xoa, bạn có thể dùng 25 gr bột rau câu giòn, nấu cùng 1 lít nước lọc nếu bạn không tìm được rong biển khô để nấu xoa xoa.	12	/culinary-blog/recipes/44719da2-3815-5f03-9ea6-9b4b6597fdd0/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
7e82edb7-fb48-47cc-8a4e-30f3077e12a7	44719da2-3815-5f03-9ea6-9b4b6597fdd0	6	Hấp chín đậu xanh	Đậu xanh sau khi ngâm trong 2 tiếng cho nở, bạn đem hấp chín với một chút muối. Nếu thích ăn đậu xanh mịn, bạn có thể cho đậu xanh hấp chín vào máy xay nhuyễn.	10	/culinary-blog/recipes/44719da2-3815-5f03-9ea6-9b4b6597fdd0/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a5f6b38a-f6e1-4909-b1cf-d2a1a5622650	44719da2-3815-5f03-9ea6-9b4b6597fdd0	7	Thành phẩm	Cho sương sáo, sương sa, lá sâm, hạt lựu và đậu xanh vào tô. Thêm nước cốt dừa béo ngậy cùng đá bào là bạn đã có món chè xoa xoa hạt lựu mát lạnh, chuẩn vị cho ngày hè oi ả rồi.	8	/culinary-blog/recipes/44719da2-3815-5f03-9ea6-9b4b6597fdd0/steps/7.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b89dd185-915d-429d-a0d2-996ef4b638b4	4671a59b-6982-50c5-9aa6-7785ba32450c	1	Nhồi bột (Lấy trùng bột)	Bạn cho 1 muỗng canh bột nếp (khoảng 10gr) vào nồi cùng 350ml nước, khuấy đều rồi nấu ở lửa vừa cho đến khi hỗn hợp bột sôi và trong lại. Sau đó, bạn rưới từ từ phần nước bột nóng này vào 400gr bột nếp trong tô, dùng cây trộn đều cho bớt nóng rồi dùng tay nhồi kỹ thành khối bột mịn, dẻo. Bạn đậy kín bột và để bột nghỉ trong khoảng 30 phút.	30	/culinary-blog/recipes/4671a59b-6982-50c5-9aa6-7785ba32450c/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b1c694e3-96c0-4175-92be-74b3194413a3	4671a59b-6982-50c5-9aa6-7785ba32450c	2	Làm nhân đậu xanh	Bạn cho 100gr đậu xanh đã ngâm nở, 100ml nước và 2gr muối vào nồi nấu ở lửa vừa. Khi nước sôi, bạn hớt sạch bọt rồi đậy hờ nắp, nấu nhỏ lửa đến khi cạn nước và đậu chín mềm. Tiếp theo, bạn cho 50gr nước cốt dừa nhất vào sên cùng đậu xanh, khuấy đều tay đến khi đậu dẻo mịn thành một khối không dính nồi thì tắt bếp. Sau đó, bạn chia nhân và vo thành 20 viên tròn nhỏ bằng nhau.	15	/culinary-blog/recipes/4671a59b-6982-50c5-9aa6-7785ba32450c/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
73a74ed1-83ac-4161-a36a-6200ef2fef00	4671a59b-6982-50c5-9aa6-7785ba32450c	3	Nấu nước đường gừng	Bạn cho 1.5 lít nước vào nồi cùng 350gr đường thốt nốt và 30gr gừng cắt sợi (gừng nên rửa qua nước để khi nấu nước đường không bị đục). Bạn đun sôi cho đường tan hoàn toàn, nước gừng tỏa mùi thơm nồng đặc trưng.	10	/culinary-blog/recipes/4671a59b-6982-50c5-9aa6-7785ba32450c/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
94d66bc3-24a3-4e3c-b727-0f8f7e791b88	4671a59b-6982-50c5-9aa6-7785ba32450c	4	Nặn và nấu viên bột bánh trôi	Lấy một lượng bột nếp gấp khoảng 3 lần viên nhân, vo tròn rồi ấn dẹt, cho viên nhân vào giữa rồi gói kín lại. Chuẩn bị một nồi nước sôi khác có pha 15gr đường cát, cho viên bánh vào rửa sơ cho se mặt bột rồi vớt ngay ra cho vào nồi nước đường đang sôi. Bạn nấu bánh trong nước đường ở lửa vừa khoảng 15 phút để bánh chín đều, thấm vị ngọt và đạt độ dẻo mịn hoàn hảo.	7	/culinary-blog/recipes/4671a59b-6982-50c5-9aa6-7785ba32450c/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8fc44fa0-cf2f-4949-b587-a8b2ebda523a	4671a59b-6982-50c5-9aa6-7785ba32450c	5	Nấu nước cốt dừa ăn kèm	Cho 450gr nước cốt dừa, 15gr đường, 15gr bột năng, 10gr bột gạo và 2gr muối vào nồi, khuấy cho tan bột trước khi bật bếp. Nấu ở lửa vừa, khuấy đều tay đến khi nước cốt sôi và sánh đặc lại thì tắt bếp.	6	/culinary-blog/recipes/4671a59b-6982-50c5-9aa6-7785ba32450c/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3a5b7749-b702-4d77-a1cb-71584fcdf9c2	4671a59b-6982-50c5-9aa6-7785ba32450c	6	Thành phẩm	Món bánh trôi nước hay còn gọi là bánh chay hoàn thành có màu vàng cánh gián đẹp mắt, nước đường trong và thơm mùi gừng. Viên bánh dẻo quện, nhân đậu xanh béo bùi rất vừa miệng. Khi ăn, bạn múc bánh ra chén, rưới thêm nước cốt dừa béo ngậy và rắc đậu phộng, mè rang lên trên để thưởng thức.	5	/culinary-blog/recipes/4671a59b-6982-50c5-9aa6-7785ba32450c/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ecc97723-3dab-4c5d-808b-a018dc0c5ab4	94316a16-622a-47c9-a58d-dcb00ad86454	1	Sơ chế gà và lá chanh	Rửa sạch gà bằng nước muối loãng, lá chanh thái chỉ mỏng.	5	/culinary-blog/categories/mon-khai-vi.jpg	2026-11-20 10:48:56.744573+00	\N	f	\\xff2e1499b9540b44bb64f1eb0af83706
fa6c71f8-d13d-47d6-b034-f5f7fb501f05	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	2	Nấu nước đường	Cho 1 lít nước và 1 bó lá dứa tươi đã rửa sạch vào nồi. Đun sôi. Khi nước đã sôi, cho 200gr đường phèn vào. Nấu thêm khoảng gần 10 phút cho đường tan hoàn toàn thì tắt bếp và vớt lá dứa. Để nước đường nguội hoàn toàn.	15	/culinary-blog/recipes/5e6d38a2-9e40-5c69-a68a-fd755fa3199d/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3161f359-c838-47ea-9e82-b1733efb95d5	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	3	Ngâm gelatin	Ngâm 40gr gelatin lá trong nước đá khoảng 5 phút cho mềm.	10	/culinary-blog/recipes/5e6d38a2-9e40-5c69-a68a-fd755fa3199d/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
fb852981-deac-4abd-ba06-2ea780a650cd	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	4	Nấu hỗn hợp whipping cream	Bạn cho 1 lít sữa tươi và 200gr đường và 40 gr gelatin đã ngâm mềm ra vào nồi. Đun với lửa nhỏ, vừa đun vừa khuấy nhẹ cho đường tan. Khi sữa bắt đầu bốc khói nhẹ thì bạn tắt bếp. Tuyệt đối không để sôi bùng làm mất độ béo. Sau cùng, đổ 250ml whipping cream vào hòa quyện.	7	/culinary-blog/recipes/5e6d38a2-9e40-5c69-a68a-fd755fa3199d/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e3ebea7b-839c-4198-86f2-6f3b63875352	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	5	Nấu rau cau dẻo	Trộn 1 muỗng cà phê bột rau câu dẻo với 1 muỗng canh đường. Sau đó, từ từ rót 250ml nước lọc vào, khuấy đều và đun sôi trong 5 phút. Cuối cùng, đổ hỗn hợp rau câu này vào nồi sữa whipping cream ở bước 5 và khuấy đều tay.	6	/culinary-blog/recipes/5e6d38a2-9e40-5c69-a68a-fd755fa3199d/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
23ff4a52-2466-4db1-bc91-b6f627c883ee	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	6	Chuẩn bị màu	Đầu tiên, bạn hòa tan 2 muỗng cà phê bột trà xanh với chút nước ở chén nhỏ cho tan mịn để riêng làm màu xanh. Tiếp theo, vắt lấy nước cốt thanh long đỏ để riêng làm màu hồng.	5	/culinary-blog/recipes/5e6d38a2-9e40-5c69-a68a-fd755fa3199d/steps/6.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
8a18779c-0ff2-487d-b716-22eebbdf4719	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	7	Tạo màu và hương vị tự nhiên	Chia hỗn hợp sữa gelatin whipping cream vừa nấu xong ra làm 3 phần: Phần 1 (Màu trắng): Bạn để nguyên trong nồi, thêm 2 ống vani (hoặc hương hạnh nhân) khuấy đều cho thơm. Phần 2 (Màu xanh): Rót sữa ra tô, cho hỗn hợp trà xanh đã khuấy vào hòa quyện. Phần 3 (Màu hồng): Rót sữa ra tô còn lại, cho nước cốt thanh long và 2 ống vani vào khuấy đều đến khi đạt màu hồng ưng ý.	5	/culinary-blog/recipes/5e6d38a2-9e40-5c69-a68a-fd755fa3199d/steps/7.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c303e908-45f8-4eeb-b838-1a0310512ce8	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	8	Đổ khuôn và làm đông thạch	Rót thạch vào các khuôn nhựa hoặc hộp giấy đã chuẩn bị sẵn. Bạn nên đổ nhẹ tay để bề mặt thạch phẳng đẹp. Để thạch nguội hẳn bên ngoài rồi mới đặt vào ngăn mát tủ lạnh từ 3 – 6 tiếng.	5	/culinary-blog/recipes/5e6d38a2-9e40-5c69-a68a-fd755fa3199d/steps/8.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b26ffc0d-e251-48c6-aafa-bf41b46f353b	5e6d38a2-9e40-5c69-a68a-fd755fa3199d	9	Thành phẩm	Khi thạch đã đông và núng nính đẹp mắt, bạn lấy ra cắt thành từng miếng vuông vừa ăn. Cho thạch vào bát, thêm nước đường lá dứa thơm mát, một ít nước vải, đá viên và cuối cùng là rắc hạnh nhân rang giòn lên trên. Miếng khúc bạch làm từ gelatin kết hợp rau câu có độ mềm mại tuyệt vời, vừa chạm vào đầu lưỡi đã tan ra, để lại vị béo ngậy của sữa và whipping cream.	5	/culinary-blog/recipes/5e6d38a2-9e40-5c69-a68a-fd755fa3199d/steps/9.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
82482a90-1825-4b0d-aa4e-d487a70b7d2f	547555be-a016-527b-847c-c090af4091ac	1	Sơ chế nguyên liệu	Măng cụt tươi sau khi tách vỏ, lấy được khoảng 500gr thịt quả thì đem ngâm vào nước muối loãng để giữ độ tươi và tránh thâm màu. Chanh dây cắt đôi, lấy phần ruột thì thu được khoảng 100gr cốt chanh dây. Cho cốt chanh dây vào tô, thêm vào 100gr đường vàng và 2gr muối, sau đó trộn đều để đường tan và hỗn hợp ngấm vị. Chia măng cụt thành hai phần, 200gr đem dằm nhuyễn, 300gr giữ nguyên tép. Trộn cả hai phần măng cụt với hỗn hợp chanh dây đã ngâm đường, đảo đều rồi để hỗn hợp nghỉ ở nhiệt độ phòng trong khoảng 4 tiếng để măng cụt thấm vị chua ngọt tự nhiên.	240	/culinary-blog/recipes/547555be-a016-527b-847c-c090af4091ac/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d7519cb9-e00c-483c-91f8-d61eb7d1ccb6	547555be-a016-527b-847c-c090af4091ac	2	Pha trà hoa nhài	Ủ 5gr trà xanh hoa nhài với 150ml nước sôi ở 80°C trong khoảng 5 phút. Sau đó lọc bỏ xác trà, giữ lại phần nước cốt để dùng pha.	120	/culinary-blog/recipes/547555be-a016-527b-847c-c090af4091ac/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
316df9c5-108a-46ca-b90a-6362e18cd5aa	547555be-a016-527b-847c-c090af4091ac	3	Pha trà măng cụt chanh dây	Cho 50gr thịt măng cụt vào bình lắc và dằm nhuyễn. Tiếp tục cho vào bình 10ml đường, 20ml nước cốt chanh dây, 30ml sirô măng cụt và 150ml nước trà hoa nhài đã pha. Thêm đá viên vừa đủ, sau đó đậy nắp và lắc đều.	80	/culinary-blog/recipes/547555be-a016-527b-847c-c090af4091ac/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
ab5969a1-e3e9-483c-ad6b-d4a9e79d3581	547555be-a016-527b-847c-c090af4091ac	4	Thành phẩm	Bạn sẽ có một ly trà măng cụt chanh dây dung tích 700ml với hương vị hài hòa giữa vị chua nhẹ của chanh dây, vị ngọt thanh từ măng cụt và mùi trà hoa nhài thoang thoảng. Thức uống không chỉ mát lạnh sảng khoái mà còn mang đến cảm giác thư giãn, dễ chịu ngay từ ngụm đầu tiên.	60	/culinary-blog/recipes/547555be-a016-527b-847c-c090af4091ac/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f69a2a0b-149f-4265-b5be-753b99d14e41	635a5b95-7912-5833-8f01-376166ad87d2	1	Sơ chế dâu tằm tươi	Đầu tiên, bạn nhặt bỏ hết phần lá, cuống dâu và loại bỏ những quả bị hỏng. Sau đó, bạn mang dâu đi rửa sạch với nước từ 3 tới 4 lần hoặc rửa đến khi thấy nước trong là được. Khi rửa, bạn lưu ý phải thật nhẹ tay vì những quả dâu chín rất dễ bị dập nát. Cuối cùng, bạn vớt dâu ra và để thật ráo nước.	15	/culinary-blog/recipes/635a5b95-7912-5833-8f01-376166ad87d2/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
03afc158-68bc-472a-8fa3-230fe20c4667	635a5b95-7912-5833-8f01-376166ad87d2	2	Ngâm dâu với đường và muối	Khi dâu đã ráo nước hoàn toàn, bạn mang dâu đi ướp cùng với 1.4kg đường cát và 8g muối. Bạn đảo đều và để dâu nghỉ trong khoảng từ 3 - 5 tiếng cho đến khi đường tan hết, dâu ngấm đường và tiết ra nước siro dâu tằm.	7	/culinary-blog/recipes/635a5b95-7912-5833-8f01-376166ad87d2/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
4be0ca1c-ff2d-46de-b080-dc7e0682a0cc	94316a16-622a-47c9-a58d-dcb00ad86454	3	Hấp chín và thưởng thức	Hấp cách thủy trong 20 phút cho gà chín tới, rắc lá chanh lên trên.	20	/culinary-blog/categories/mon-khai-vi.jpg	2026-11-20 10:48:56.744573+00	\N	f	\\x5a0ee1211fa047429db06de79f3a6edf
e9d72b6e-b51d-4246-9c1b-29a4898c74ab	94316a16-622a-47c9-a58d-dcb00ad86454	2	Tẩm ướp gia vị	Ướp gà với muối, tiêu và một nửa lá chanh trong 15 phút.	15	/culinary-blog/categories/mon-khai-vi.jpg	2026-11-20 10:48:56.744573+00	\N	f	\\xaa2a65a4994cda40bc652d91f041f528
acb26374-4bf9-4d60-9eed-a09641b71976	635a5b95-7912-5833-8f01-376166ad87d2	3	Nấu nước cốt dâu tằm thơm lừng	Bạn chắt lấy phần nước siro dâu cho vào nồi và đun sôi trên bếp. Trong lúc đun, bạn cần hớt sạch bọt để nước dâu được trong và đẹp hơn. Sau khi nước siro sôi, bạn mới cho phần quả dâu vào và đun tiếp trong khoảng 5 phút. Sau khi nấu xong, bạn nhấc nồi ra đợi cho hỗn hợp dâu nguội hẳn. Sau đó, bạn chia nước cốt và quả dâu vào từng hũ thủy tinh sạch, đậy kín nắp và bảo quản trong ngăn mát tủ lạnh để dùng dần.	5	/culinary-blog/recipes/635a5b95-7912-5833-8f01-376166ad87d2/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
d64a4273-bc7b-44ec-b264-17008522707c	635a5b95-7912-5833-8f01-376166ad87d2	4	Pha chế nước dâu tằm giải khát	Để pha một ly nước 500ml, bạn cho các nguyên liệu vào bình gồm: 100ml nước cốt dâu tằm đã nấu, 150ml nước lọc, 1 muỗng quả dâu tằm, 1 quả tắc vắt lấy cốt (hoặc 10ml nước chanh vàng) và 150gr đá viên. Bạn đậy nắp bình và lắc thật đều tay. Nếu không có bình lắc hoặc pha cho nhiều người, bạn có thể pha tất cả vào một âu lớn rồi rót ra từng ly có sẵn đá. Để tăng thêm sự hấp dẫn, bạn có thể thêm topping là hạt đác rim dâu tằm lên trên.	5	/culinary-blog/recipes/635a5b95-7912-5833-8f01-376166ad87d2/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
b61341f5-620a-49cc-801a-a6f50d9ef835	635a5b95-7912-5833-8f01-376166ad87d2	5	Thành phẩm	Nước dâu tằm sau khi hoàn thành có màu đỏ tím cực kỳ bắt mắt. Khi uống, bạn sẽ cảm nhận được vị chua chua ngọt ngọt thanh mát, hòa quyện cùng hương thơm đặc trưng của dâu chín, rất phù hợp để giải nhiệt trong những ngày nắng nóng.	5	/culinary-blog/recipes/635a5b95-7912-5833-8f01-376166ad87d2/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
0b3845f6-cbd5-4225-82e5-f1f8a93405e8	4f40fcf1-a515-522d-848b-1535f445e73d	1	Sơ chế và hấp đậu xanh cà vỏ	Bạn đem 200gr đậu xanh cà vỏ ngâm với nước sôi trong khoảng 1 tiếng để hạt đậu nở đều. Sau đó, bạn rửa sạch lại đậu rồi cho vào xửng hấp. Bạn dàn đều đậu ra xửng và hấp trong vòng 20 phút ở lửa vừa cho đến khi hạt đậu chín mềm, khi bóp thấy hạt đậu nát mịn là được.	20	/culinary-blog/recipes/4f40fcf1-a515-522d-848b-1535f445e73d/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
03c4bf37-2592-4087-bd0b-b7b8ac353a13	4f40fcf1-a515-522d-848b-1535f445e73d	2	Làm phần đậu xanh sữa dừa	Bạn chuẩn bị một chiếc ca, cho vào 300ml nước thật sôi, 250gr sữa đặc và 80gr bột cốt dừa, sau đó khuấy đều cho hỗn hợp hòa quyện. Tiếp theo, bạn cho phần đậu xanh đã hấp chín vào máy xay cùng với hỗn hợp sữa dừa vừa pha và 1/2 muỗng cà phê muối. Sau khi xay lần 1 khoảng 90 giây cho hơi mịn, bạn cho thêm 500ml nước sôi để nguội vào xay thêm 60 giây nữa cho đến khi hỗn hợp thật mịn mượt. Cuối cùng, bạn cho sữa đậu xanh vào ngăn mát tủ lạnh để hỗn hợp đặc lại, khi pha uống sẽ ngon hơn.	10	/culinary-blog/recipes/4f40fcf1-a515-522d-848b-1535f445e73d/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
c04fbb23-f847-409c-aeec-9b1579d2628d	4f40fcf1-a515-522d-848b-1535f445e73d	3	Xay rau má	Bạn rửa sạch 250gr rau má tươi, để ráo rồi cho vào máy xay cùng 500ml nước lọc. Bạn bấm máy xay 2 lần, mỗi lần 60 giây cho rau má nhuyễn mịn. Sau đó, bạn đổ rau má qua túi lọc hoặc rây lọc để vắt lấy nước cốt (không nên vắt quá kỹ để tránh bị đắng). Với khoảng 600ml nước cốt rau má thu được, bạn cho vào 90gr đường cát rồi khuấy hoặc xay sơ cho đường tan hết.	6	/culinary-blog/recipes/4f40fcf1-a515-522d-848b-1535f445e73d/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
9807ba08-352e-4dd4-98ac-8257a6ccddd6	4f40fcf1-a515-522d-848b-1535f445e73d	4	Thành phẩm	Bạn chuẩn bị ly lớn, đổ khoảng 150ml hỗn hợp đậu xanh sữa dừa vào trước. Tiếp theo, bạn cho đầy đá viên vào ly. Cuối cùng, bạn từ từ rót nước rau má đã pha đường lên phía trên là hoàn tất. Rau má đậu xanh sữa dừa sau khi hoàn thành có màu sắc phân tầng đẹp mắt với lớp xanh đậm của rau má và lớp vàng nhạt của đậu xanh. Khi uống, bạn sẽ cảm nhận được vị thanh mát của rau má tươi, hòa cùng độ bùi bùi của đậu xanh và độ béo ngậy, thơm lừng của sữa dừa. Nếu thích, bạn có thể thêm topping trân châu hoặc thạch lá dứa để món nước thêm hấp dẫn.	5	/culinary-blog/recipes/4f40fcf1-a515-522d-848b-1535f445e73d/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
a501fafe-c6d3-41e4-8cd2-590dec5e9cc6	12ecd2b0-8b5a-5864-8643-b81bda0136e2	1	Ủ trà thơm ngon chuẩn vị	Đầu tiên, bạn cho 30 gr trà lài và 30 gr hồng trà vào chung một bình hoặc tô lớn. Thêm vào 2 lít nước đun xôi vào. Đậy nắp kín và ủ trà trong vòng đúng 10 phút.	20	/culinary-blog/recipes/12ecd2b0-8b5a-5864-8643-b81bda0136e2/steps/1.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
58f58be2-d6bc-4e65-abc1-f5752655d81e	12ecd2b0-8b5a-5864-8643-b81bda0136e2	2	Nấu nước đường sánh kẹo	Cho 500 gr đường và 1/5 muỗng cà phê muối vào nồi. Tiếp đến, thêm 500 ml nước lọc. Bắc nồi lên bếp, mở lửa vừa và dùng giá khuấy đều liên tục để đường tan hoàn toàn, tránh bị khét ở đáy nồi. Khi nước đường sôi lên và đường vừa tan hết, tắt bếp ngay. Không cần nấu quá lâu vì nước đường sẽ tự sánh kẹo khi nguội. Để nước đường nguội hoàn toàn.	10	/culinary-blog/recipes/12ecd2b0-8b5a-5864-8643-b81bda0136e2/steps/2.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
f6d19ed3-98f5-4442-b6c5-9998d085de3f	12ecd2b0-8b5a-5864-8643-b81bda0136e2	3	Sơ chế và lấy nước cốt tắc	Rửa sạch tắc, cắt đôi và vắt lấy nước cốt. Bạn có thể dùng dụng cụ vắt cam hoặc vắt bằng tay. Loại bỏ hạt để nước cốt tắc không bị đắng.	6	/culinary-blog/recipes/12ecd2b0-8b5a-5864-8643-b81bda0136e2/steps/3.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e7ce751b-3cc3-410b-889b-fdd2e4b1d977	12ecd2b0-8b5a-5864-8643-b81bda0136e2	4	Công thức pha chế trà tắc giải khát	Khi nước cốt trà và nước đường đã nguội hoàn toàn, chúng ta bắt đầu pha chế. Với ly có dung tích 1 lít, bạn cho vào lần lượt: 120 ml nước cốt trà, 150 ml nước đường, 30 ml nước cốt tắc. Khuấy đều hỗn hợp hoặc cho vào bình lắc và lắc mạnh để các nguyên liệu hòa quyện vào nhau. Cuối cùng, thêm đá viên đầy ly tùy theo sở thích và nhu cầu kinh doanh của bạn.	5	/culinary-blog/recipes/12ecd2b0-8b5a-5864-8643-b81bda0136e2/steps/4.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
e177e81c-1a4b-4fb9-b14b-ec9a121ea108	12ecd2b0-8b5a-5864-8643-b81bda0136e2	5	Thành phẩm	Ly trà tắc thơm ngon, chua ngọt hài hòa đã sẵn sàng để thưởng thức hoặc phục vụ khách hàng. Màu trà vàng óng đẹp mắt, hương thơm của trà lài, hồng trà và tắc quyện vào nhau tạo nên một thức uống giải khát tuyệt vời cho những ngày nắng nóng. Đừng quên trang trí thêm vài lát tắc mỏng để ly nước thêm phần hấp dẫn nhé!	5	/culinary-blog/recipes/12ecd2b0-8b5a-5864-8643-b81bda0136e2/steps/5.jpg	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001
3498cfdf-f8c5-4949-a087-1d6b7d7efc32	8fb6b8bb-aad6-4a1e-8dbc-cc9ea67452e6	1	Sơ chế thịt bò	Rửa sạch thịt bò thăn, thái lát dày khoảng 0.5cm, thấm khô bằng khăn sạch.	10	http://localhost:9000/culinary-blog/recipes/mon-bo-kho-chuan-vi-bo-kho-truyen-thong-dam-da-kho-cuong-step-1.jpg	2026-11-20 11:39:25.63994+00	\N	f	\\xda8d91878be1ad4db90f7e884025936d
59af7ff0-50ba-4a03-af2b-cdbda395cc0e	8fb6b8bb-aad6-4a1e-8dbc-cc9ea67452e6	2	Ướp gia vị	Ướp thịt bò với tỏi băm, tiêu đen đập dập, dầu hào, nước tương trong 15 phút.	15	http://localhost:9000/culinary-blog/recipes/mon-bo-kho-chuan-vi-bo-kho-truyen-thong-dam-da-kho-cuong-step-1.jpg	2026-11-20 11:39:25.730289+00	\N	f	\\x6c35c6fffbe87f45a82d663a8d522725
af78dbc8-7892-4786-8b94-a2662c9d6034	8fb6b8bb-aad6-4a1e-8dbc-cc9ea67452e6	3	Áp chảo bò né	Làm nóng chảo gang, cho bơ lạt vào đun chảy rồi trút thịt bò vào áp chảo lửa lớn.	5	http://localhost:9000/culinary-blog/recipes/mon-bo-kho-chuan-vi-bo-kho-truyen-thong-dam-da-kho-cuong-step-1.jpg	2026-11-20 11:39:25.792309+00	\N	f	\\x7865025da7a7f046bc32c31db9b5bb97
334434b8-c9a1-4f86-837f-5f75cd45b979	8fb6b8bb-aad6-4a1e-8dbc-cc9ea67452e6	4	Hoàn thành và thưởng thức	Đập trứng gà vào chảo, rắc phô mai bào sợi lên trên, tắt bếp khi trứng vừa chín tới.	3	http://localhost:9000/culinary-blog/recipes/mon-bo-kho-chuan-vi-bo-kho-truyen-thong-dam-da-kho-cuong-step-1.jpg	2026-11-20 11:39:25.835204+00	\N	f	\\x92dc5c22b88d384da3d2e0393228c431
\.


--
-- Data for Name: Recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Recipes" ("Id", "Title", "Slug", "Description", "Instructions", "PrepTimeMinutes", "CookTimeMinutes", "Servings", "Difficulty", "Status", "CategoryId", "AuthorId", "PublishedAt", "Nutrition_Calories", "Nutrition_Protein", "Nutrition_Carbohydrates", "Nutrition_Fat", "Nutrition_Fiber", "Nutrition_Sodium", "CreatedAt", "UpdatedAt", "IsDeleted", "RowVersion", "BookmarkCount", "ViewCount") FROM stdin;
d7fe03bf-8d56-5f1c-b9e4-e0d70760050c	Chả giò miền Nam nhân tôm thịt ngon giòn tan để đãi tiệc gia đình	cha-gio-mien-nam-nhan-tom-thit-ngon-gion-tan-de-dai-tiec-gia	Cùng Vào bếp thực hiện chả giò miền Nam vàng ươm, giòn rụm. Với cách làm chả giò tôm thịt miền nam này, bạn sẽ có món chiên hấp dẫn, đậm đà vị khoai môn cao và mộc nhĩ, hứa hẹn thành công ngay lần đầu.	### Hướng dẫn cách nấu: Chả giò miền Nam nhân tôm thịt ngon giòn tan để đãi tiệc gia đình\n\n**Bước 1: Sơ chế thịt heo xay và tôm tươi**\nThịt heo mua về rửa sạch với muối và giấm, thấm khô rồi xay nhuyễn. Tôm bóc vỏ, rửa sạch, thấm thật khô nước trước khi mang đi xay mịn để nhân không bị bở.\n\n**Bước 2: Chuẩn bị rau củ, mộc nhĩ và miến**\nBăm nhỏ hành tím và tỏi, xắt nhuyễn hành lá. Mộc nhĩ (nấm mèo) ngâm nở, xắt sợi rồi băm nhẹ để giữ độ giòn. Miến (bún tàu) ngâm nước 3 phút cho mềm rồi cắt khúc ngắn.\n\n**Bước 3: Bào sợi khoai môn cao và phi thơm hành tỏi**\nBào sợi khoai môn cao và cà rốt dài khoảng 3 - 4cm. Trải đều ra mẹt, hong quạt 30 phút cho ráo nước giúp chả giòn lâu. Sau đó, phi thơm hành tỏi với dầu ăn đến khi se mặt.\n\n**Bước 4: Trộn nhân và gói chả giò với bánh tráng dẻo**\nCho thịt và tôm vào tô lớn, thêm 1.5 muỗng canh bột nêm gà, 1.5 muỗng canh đường, 1 muỗng cà phê muối, 1 muỗng cà phê tiêu, hành lá xắt nhuyễn và phần hành tỏi đã phi thơm vào trộn đều. Sau đó, bạn cho tiếp khoai môn, cà rốt, nấm mèo và bún tàu vào trộn thật đều tay cho nhân hòa quyện. Bạn trải miếng bánh cuốn ra theo chiều góc nhọn hướng về phía mình, múc một muỗng nhân cho vào và dàn đều. Bạn xếp góc dưới lên nhân, gập hai đầu bánh lại cho đều nhau rồi cuộn tròn. Cuối cùng, bạn dùng hỗn hợp bột mì pha một ít nước bôi vào mép để dán cuốn chả cho chắc chắn.\n\n**Bước 5: Chiên ngập dầu cho cuốn chả giòn tan**\nCho chả đã cuốn vào ngăn mát tủ lạnh ít nhất 30 phút để bề mặt khô ráo. Đun nóng dầu ăn đến khoảng 150 độ C rồi lần lượt cho chả vào chiên ở lửa vừa, xoay trở đều tay. Khi chả đã vàng đều, bạn tăng lửa lớn để dầu không thấm ngược vào nhân rồi vớt ra, dựng đứng trên giấy thấm dầu.\n\n**Bước 6: Thành phẩm**\nNhững cuốn chả giò miền Nam vàng ươm, lớp vỏ giòn tan và không bị vỡ nát trông cực kỳ bắt mắt. Nhân bên trong đậm đà, thơm bùi vị khoai môn và ngọt tự nhiên từ tôm thịt, ăn kèm với nước mắm chua ngọt, đồ chua và rau sống sẽ tạo nên hương vị khó cưỡng.	60	25	12	Hard	Published	b138f0a7-08c2-4041-a281-0a7eb2e63094	a343771d-bafb-4a55-9459-2739d0b00a20	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	165
b22a7344-85f2-5dff-abee-0dfcb97903d8	3 món từ măng cụt: Gỏi gà măng cụt, sinh tố măng cụt, chè măng cụt	3-mon-tu-mang-cut-goi-ga-mang-cut-sinh-to-mang-cut-che-mang-	Măng cụt là loại trái cây rất ngon và giàu dinh dưỡng, ngoài cách ăn trực tiếp bạn cũng có thể kết hợp măng cụt thành những món ăn bổ dưỡng. Các bạn hãy vào bếp cùng Điện máy XANH chế biến 3 món ăn từ măng cụt: Gỏi gà măng cụt, sinh tố măng cụt, chè măng cụt.	### Hướng dẫn cách nấu: 3 món từ măng cụt: Gỏi gà măng cụt, sinh tố măng cụt, chè măng cụt\n\n**Bước 1: Chuẩn bị nguyên liệu**\nChanh mua về bạn rửa sạch, cắt làm đôi và bỏ hạt. Bạn có thể cắt chanh thành những lát mỏng để trang trí cho ly sinh tố thêm đẹp mắt nha! Đối với măng cụt, bạn dùng dao cắt ngang quả, trong quá trình cắt ấn nhẹ và xoay quanh thân quả. Khi tách được lớp vỏ phía trên ra, bạn bóc từng múi măng cụt ra nhé!\n\n**Bước 2: Xay sinh tố**\nCho phần măng cụt đã chuẩn bị, 50ml whipping cream, 1 muỗng canh sữa đặc cùng 200gr đá viên vào máy xay sinh tố. Tiếp theo, bạn vắt nửa quả chanh vào cối để lấy phần nước cốt rồi bật máy và xay trong 2 phút. Khi thấy hỗn hợp đồng nhất lại với nhau là được rồi nhé!\n\n**Bước 3: Thành phẩm**\nLy sinh tố măng cụt như thế là hoàn thành rồi đấy! Thật đơn giản đúng không nào? Vị ngọt chua thanh của măng cụt kết hợp với chanh cộng chút lạnh của đá, uống một ngụm sẽ cảm thấy thật ngon lành làm sao!\n\n**Bước 4: Nấu chè**\nBạn cho vào nồi phần nước lá dứa, nước cốt dừa, đường nâu, 100 ml nước đun sôi cho hỗn hợp hơi đặc lại thì tắt bếp. Múi măng cụt đã lăn qua bột năng bạn thả vào nồi luộc chín. Thấy bột năng trở nên trong suốt là đã chín, bạn tắt bếp vớt măng cụt ra thả vào nước sôi để nguội. Khi ăn bạn chỉ cần thả măng cụt vào hỗn hợp lá dứa và thưởng thức.	15	20	2	Easy	Published	b138f0a7-08c2-4041-a281-0a7eb2e63094	852cc4dc-913d-4d95-8962-4c5407d77d3c	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	69
2a7249a8-81a4-56c0-aaba-3b2d96272ef1	Gỏi bò rau má thơm ngon thanh mát giải nhiệt cho cả gia đình	goi-bo-rau-ma-thom-ngon-thanh-mat-giai-nhiet-cho-ca-gia-dinh	Cùng Điện máy XANH vào bếp thực hiện món gỏi bò rau má cực đơn giản để đổi vị cho cả nhà. Đây là món gỏi - salad thanh mát, giúp giải nhiệt hiệu quả. Với vị thịt bò mềm ngọt quyện cùng rau má giòn tươi, món gỏi bò rau má chắc chắn sẽ khiến thực khách thích mê.	### Hướng dẫn cách nấu: Gỏi bò rau má thơm ngon thanh mát giải nhiệt cho cả gia đình\n\n**Bước 1: Sơ chế nguyên liệu làm gỏi bò rau má**\nBạn đem 400gr thịt bò đi rửa sạch bằng nước muối loãng pha thêm gừng đập dập, sau đó lau khô và cắt thành các lát mỏng vừa ăn. Rau má nhặt sạch, rửa nhiều lần với nước rồi để ráo. Cà rốt bạn gọt vỏ, bào sợi. Hành tây lột vỏ, cắt lát mỏng. Tiếp theo, bạn chuẩn bị một thau nước đá lạnh, cho cà rốt bào sợi và hành tây vào ngâm trong khoảng 15 phút để giảm vị hăng và tăng độ giòn, sau đó vớt ra để thật ráo nước.\n\n**Bước 2: Ướp thịt bò chuẩn bị cho món nộm**\nBạn cho thịt bò đã cắt vào tô, thêm vào 1/2 muỗng canh tỏi băm, 1 muỗng canh nước tương, 1 muỗng canh dầu ăn (giúp thịt mềm hơn), 1 muỗng canh dầu hào, 1 muỗng cà phê bột ngọt và 1/2 muỗng cà phê tiêu xay. Bạn trộn đều và để thịt bò thấm gia vị trong ít nhất 30 phút.\n\n**Bước 3: Pha nước sốt trộn gỏi chua ngọt**\nBạn cho vào chén 2 muỗng canh đường, 3 muỗng canh nước mắm, 1 muỗng canh tương ớt và 1.5 muỗng canh nước cốt tắc. Sau đó, bạn cho ớt sừng băm nhỏ vào (điều chỉnh lượng ớt tùy theo khả năng ăn cay) rồi khuấy đều cho đến khi đường tan hoàn toàn và hỗn hợp nước sốt đồng nhất.\n\n**Bước 4: Xào thịt bò nhanh tay**\nBạn bắc chảo lên bếp, cho 1 muỗng canh dầu ăn vào. Khi dầu nóng, bạn cho phần tỏi băm còn lại vào phi thơm. Sau đó, bạn cho thịt bò đã ướp vào xào nhanh tay trên lửa lớn trong khoảng hơn 1 phút cho đến khi thịt vừa chín tới thì tắt bếp ngay để thịt giữ được độ mềm mọng, không bị dai.\n\n**Bước 5: Trộn gỏi rau má thịt bò**\nBạn chuẩn bị một chiếc thau lớn, cho cà rốt, hành tây và rau má vào trước, sau đó cho thêm một ít rau húng lủi. Bạn cho toàn bộ phần thịt bò đã xào vào thau, rưới nước sốt lên trên. Bạn đeo bao tay nilon và trộn nhẹ tay để các nguyên liệu thấm đều nước sốt mà rau không bị dập. Cuối cùng, bạn cho đậu phộng rang và hành phi vào trộn sơ một lần nữa là hoàn thành.\n\n**Bước 6: Thành phẩm**\nMón gỏi bò rau má sau khi hoàn thành có màu sắc rất bắt mắt của rau má xanh mướt, cà rốt cam và thịt bò nâu bóng. Khi ăn, bạn sẽ cảm nhận được vị thịt bò mềm ngọt, rau má giòn mát hòa quyện cùng nước sốt chua ngọt cay nhẹ rất vừa miệng.	45	10	3	Easy	Published	b138f0a7-08c2-4041-a281-0a7eb2e63094	cc06a093-474f-4659-9db0-ed4c708e2978	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	192
d8cbdeb6-c6d3-5cb3-bf2d-50761ed98c5a	Nem rán chay - chả giò chay giòn tan ngon khó cưỡng	nem-ran-chay-cha-gio-chay-gion-tan-ngon-kho-cuong	Vào những ngày chay hay là những ngày "chán thịt", bạn luôn đắn đo suy nghĩ không biết nên nấu món gì. Vậy thì hãy cùng vào bếp với Điện máy XANH để học ngay cách làm món chay là nem rán chay - chả giò chay giòn tan rôm rốp, chắc chắn sẽ khiến bạn và gia đình phát mê đấy nhé!	### Hướng dẫn cách nấu: Nem rán chay - chả giò chay giòn tan ngon khó cưỡng\n\n**Bước 1: Sơ chế nguyên liệu**\nBạn cho bún tàu ra chén, đổ một lượng nước ấm ngập bún tàu và ngâm khoảng 10 - 15 phút cho bún mềm ra. Sau đó, dùng kéo cắt bún thành các khúc vừa ăn khoảng 1 ngón tay ra rây lọc cho ráo nước. Bạn ngâm với nước sôi khoảng 5 phút. Tiếp đến múc đậu hũ vào một túi vải, dùng muỗng dằm nhuyễn ra, rồi vắt đậu hũ cho ráo nước, để ra tô đựng. Đậu xanh bạn vo sạch, ngâm mềm trong nước ấm từ 2 - 3 tiếng, tách bỏ vỏ, rồi mang đi hấp khoảng 15 phút cho đậu chín mềm. Củ sắn gọt vỏ, dùng dao bào để bào củ sắn thành các sợi nhỏ, cho khoảng 1/2 muỗng cà phê muối vào, trộn đều và ngâm khoảng 5 phút. Sau đó, cho củ sắn vào túi vải, vắt ráo nước. Với cà rốt, khoai môn bạn rửa sạch, gọt bỏ vỏ và cũng sử dụng dao bào để gọt thành các sợi nhỏ. Nấm mèo ngâm với nước ấm khoảng 10 phút cho nấm mềm, cắt bỏ chân nấm. Kế tiếp, băm nhỏ nấm mèo ra. Hành lá bạn chia phần lá và phần đầu hành ra riêng, mỗi phần bạn cắt nhỏ ra.\n\n**Bước 2: Xào đậu hũ và chiên khoai tây**\nBắc chảo đặt lên bếp, cho từ 3 - 4 muỗng canh dầu ăn vào chảo rồi phi vàng đầu hành lá ở lửa vừa. Sau đó, đổ hành lá ra một rây lọc để chắt lấy phần dầu, còn hành được phi vàng cho ra chén đựng. Sử dụng tiếp cái chảo lúc nãy, bạn cho khoảng 2 muỗng canh dầu hành vào, rồi cho hết đậu hũ vào chảo, nêm thêm 1 muỗng cà phê hạt nêm chay, 1 muỗng cà phê đường, 1/2 muỗng cà phê tiêu, trộn đều và xào đậu hũ ở lửa vừa đến khi thấy đậu hũ săn lại thì cho ra tô. Bắc một cái chảo mới lên bếp, cho khoảng 100ml dầu ăn vào chảo, đun nóng dầu ở lửa vừa. Khi thấy dầu bắt đầu sôi, bạn cho khoai môn vào chảo, chiên vàng. Sau đó, cho khoai môn chiên ra dĩa đựng có lót giấy thấm dầu cho ráo dầu.\n\n**Bước 3: Trộn nhân chả giò**\nĐầu tiên, bạn cho lần lượt tất cả các nguyên liệu: khoai môn chiên, đậu hũ, nấm mèo, cà rốt, củ sắn, đậu xanh, hành phi và một ít hành lá ra khay đựng. Tiếp theo, nêm thêm vào hỗn hợp nhân 2 muỗng cà phê hạt nêm chay, 1/2 muỗng cà phê muối, 2 muỗng cà phê đường, 1/2 muỗng cà phê bột ngọt và một ít tiêu. Sau đó, dùng tay hoặc dùng đũa trộn đều các loại nhân lại với nhau.\n\n**Bước 4: Cuốn chả giò**\nBạn khuấy tan 1 muỗng canh bột mì với 2 muỗng canh nước ra chén sao cho hỗn hợp sền sệt. Tiếp theo, bạn gấp một cạnh của miếng bánh tráng lại, múc một lượng nhân vừa đủ, khoảng 1/2 muỗng canh lên chỗ nếp gấp tam giác. Sau đó, cuộn tròn lại, gấp tiếp 2 bên cạnh vào để khi chiên nhân không bị rớt ra. Để cuộn chả giò được dính chặt lại bạn thấm 1 ít nước bột mì đã pha lên mép bánh tráng dư và cố định cuốn chả lại. Cứ làm tiếp tục như vậy đến khi cuộn hết nguyên liệu.\n\n**Bước 5: Chiên chả giò**\nBắc chảo lên bếp, cho khoảng 200ml dầu ăn vào sao cho dầu ngập chảo và đun nóng ở lửa vừa. Khi thấy dầu bắt đầu sôi, bạn cho lần lượt chả giò vào chảo, chiên ở lửa lớn, trở đều 2 mặt cho đến khi thấy chả giò vàng đều 2 mặt thì vớt ra dĩa có lót giấy thấm dầu.\n\n**Bước 6: Pha nước chấm**\nĐể pha nước chấm, bạn cho 2 muỗng canh đường, 60ml nước và 2 muỗng canh nước thơm vào chảo, khuấy đều và đun nóng ở lửa nhỏ khoảng 2 phút, tắt bếp. Đổ hỗn hợp ra chén, cho thêm 2 muỗng canh nước mắm chay, 1 muỗng cà phê nước cốt chanh, khuấy đều. Băm nhỏ ớt và cho vào trong chén nước chấm nữa là xong rồi đấy nhé.\n\n**Bước 7: Thành phẩm**\nChả giò thơm lừng, vàng đều. Cắn thử một miếng chả giò, bạn sẽ nghe được âm thanh giòn tan rôm rốp, nhân bên trong ngọt mát, sần sật lẫn với đậu xanh bùi bùi. Chấm thêm với nước mắm chua chua, cay cay nữa ngon hết sẩy.\n\n**Bước 8: Sơ chế nguyên liệu**\nCà rốt, củ sắn rửa sạch, gọt bỏ vỏ, rồi dùng dao bào để bào thành các sợi nhỏ. Riêng với củ sắn, sau khi bào bạn cho vào túi vải, vắt cho ráo nước để khi chiên phần nhân không bị ướt. Hành tây gọt vỏ, băm nhuyễn. Còn rau mùi rửa sạch, băm nhỏ. Nấm mèo, nấm hương, váng đậu ngâm với nước ấm khoảng 15 phút cho mềm ra, rồi băm nhỏ. Với miến bạn cũng ngâm với nước ấm khoảng 7 - 10 phút cho mềm rồi vắt ráo nước, lấy kéo cắt thành các khúc nhỏ khoảng 2 - 3cm.\n\n**Bước 9: Trộn nhân**\nCho đậu hũ trắng ra một tô đựng, dùng muỗng dằm nhuyễn đậu hũ ra. Kế đến, cho lần lượt củ sắn, cà rốt, hành tây, rau mùi, nấm mèo, nấm hương, váng đậu, miến đã sơ chế vào trong tô đậu hũ. Nêm thêm vào hỗn hợp nhân 2 muỗng cà phê hạt nêm chay, 1 muỗng cà phê tiêu. Sau đó, trộn đều hỗn hợp, vừa trộn vừa bóp nhẹ cho các nguyên liệu hòa quyện lại với nhau, ướp trong vòng 5 - 7 phút là được nha.\n\n**Bước 10: Cuốn và chiên chả giò**\nTrải miếng bánh tráng ra thớt, cho khoảng 1 muỗng canh nhân chả giò ra miếng bánh tráng, gấp phần cạnh ngoài lại, rồi gấp tiếp 2 mép 2 bên, sau đó cuộn tròn lại là đã có cuốn chả giò đẹp mắt. Để cố định cuốn chả bạn có thể thoa một ít nước phần mép bánh cuối cùng của mỗi cuốn. Bắc chảo lên bếp và cho vào 2 chén dầu ăn rồi đun ở nhiệt độ trung bình. Khi dầu sôi, bạn lần lượt cho từng cuốn chả giò vào chiên khoảng 5 phút khi thấy chả vàng đều thì vớt ra để ráo dầu.\n\n**Bước 11: Thành phẩm**\nVậy là món nem chay rán nhân thập cẩm đã hoàn thành rồi đấy. Những cuốn nem chay được cuốn chặt, đều tay, vỏ ngoài giòn rụm, nhân bên trong ngọt bùi, ăn sần sật trong miệng. Bạn có thể cuốn nem chay với một ít rau sống cho đỡ ngán, rồi chấm cùng với nước mắm chua ngọt hay nước tương dằm ớt đều ngon tròn vị đấy nhé!	15	30	4	Easy	Published	b138f0a7-08c2-4041-a281-0a7eb2e63094	e95303ad-ac74-4ab2-88e7-e989ae0f17a4	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	113
445ef256-51b0-58aa-ba79-298d864b5f2e	Thịt kho trám xanh thơm ngon bùi béo cực hao cơm cho cả gia đình	thit-kho-tram-xanh-thom-ngon-bui-beo-cuc-hao-com-cho-ca-gia-	Cùng Vào bếp thực hiện món thịt kho trám xanh bùi béo, đậm đà cho cả gia đình. Đây là món kho dân dã, đặc sản miền Bắc cực kỳ bắt miệng với vị trám nếp đặc trưng. Công thức này hứa hẹn sẽ mang đến bữa cơm ấm cúng và ngon miệng.	### Hướng dẫn cách nấu: Thịt kho trám xanh thơm ngon bùi béo cực hao cơm cho cả gia đình\n\n**Bước 1: Sơ chế thịt ba chỉ**\nThịt ba chỉ mua về bạn rửa sạch với nước muối loãng để khử mùi, sau đó để ráo. Dùng dao thái thịt thành những miếng to vừa ăn, tương tự kích thước món thịt kho tàu để khi kho lâu thịt không bị nát. Cho thịt vào tô lớn, ướp cùng 1 thìa canh bột nêm, 1 thìa canh đường và 2 muỗng nước mắm. Thêm hành khô, ớt và hạt tiêu đã giã dập vào trộn đều, để thịt thấm gia vị trong 30 phút.\n\n**Bước 2: Sơ chế quả trám**\nQuả trám xanh ngâm rồi rửa sạch với nước muối loãng. Bạn có thể dùng dao khứa dọc quả trám để chẻ đôi hoặc dùng chày giã dập nhẹ tùy sở thích. Giã dập tuy không đẹp mắt nhưng sẽ giúp bị chát và chua của trám tiết ra nhiều hơn, giúp món ăn ngon hơn. Sau khi giã xong, bạn cho toàn bộ phần trám này vào tô thịt đã ướp gia vị, dùng tay trộn thật đều để trám và thịt hòa quyện vào nhau.\n\n**Bước 3: Cách kho thịt với trám xanh**\nBắc nồi lên bếp, làm nóng 1 thìa canh mỡ lợn rồi cho toàn bộ thịt và trám vào đảo đều ở lửa lớn. Khi thịt đã chín rắm và săn, bạn thêm 1 thìa canh nước màu đường vào đảo cùng, sau đó đổ nước lọc vào sao cho nước xăm xắp mặt thịt để bắt đầu kho. Khi nồi thịt sôi bùng lên, bạn hạ lửa nhỏ và hớt bỏ bọt. Bạn đậy nắp và kho liu riu trong khoảng 1 - 1.5 giờ cho đến khi thịt mềm nhừ, quả trám bùi và nước kho sánh lại. Lúc này, bạn nêm nếm lại cho vừa miệng rồi tắt bếp và cho thịt ra bát.\n\n**Bước 4: Thành phẩm**\nMón thịt kho trám xanh có màu nâu vàng bóng bẩy. Thịt ba chỉ béo ngậy hòa quyện cùng vị bùi bùi, chua nhẹ của quả trám tạo nên một món ăn dân dã nhưng vô cùng bắt cơm.	15	90	3	Hard	Published	33cbe291-2ee0-4fef-bbd9-310770c0ef54	ca9773bc-2065-432d-bde5-43001b2e1415	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	177
919afa90-0ae2-544c-aa7a-fab802ea448f	Miến trộn thập cẩm dai ngon chuẩn vị cực hấp dẫn, đơn giản tại nhà	mien-tron-thap-cam-dai-ngon-chuan-vi-cuc-hap-dan-don-gian-ta	Bạn đang muốn đổi vị cho bữa cơm gia đình bằng một món ăn thanh mát nhưng vẫn đầy đủ dinh dưỡng? Hãy cùng Điện máy XANH vào bếp để khám phá cách làm miến trộn thập cẩm siêu hấp dẫn. Đây là món cuốn - trộn thơm ngon với sợi miến dai mềm, thấm vị cực đỉnh mà không lo bị ngán.	### Hướng dẫn cách nấu: Miến trộn thập cẩm dai ngon chuẩn vị cực hấp dẫn, đơn giản tại nhà\n\n**Bước 1: Sơ chế rau củ và tỏi ớt băm nhỏ**\nBạn bóc vỏ tỏi rồi băm nhỏ. Cà rốt gọt vỏ, rửa sạch rồi bào sợi. Cải bó xôi rửa sạch, cắt khúc dài khoảng 5cm. Ngò rí nhặt sạch, cắt khúc 1cm. Với 1 quả ớt sừng, bạn bỏ hạt rồi cắt sợi nhỏ. Nếu thích, bạn có thể chuẩn bị thêm mộc nhĩ nấm hương để món ăn thêm phong phú.\n\n**Bước 2: Pha nước xốt trộn miến đậm đà**\nBạn cho một ít dầu ăn vào chảo, phi thơm một nửa phần tỏi băm. Tiếp theo, bạn cho vào chảo các gia vị gồm: 1 muỗng canh dầu hào, 3 muỗng canh xì dầu, 2 muỗng canh tương ớt, 2 muỗng canh đường và 50ml nước lọc. Khuấy đều cho tan và đun sôi hỗn hợp, sau đó cho thêm 1 muỗng canh nước cốt chanh vào để sốt thơm hơn rồi tắt bếp, đổ ra chén để nguội.\n\n**Bước 3: Ướp và làm thịt bò xào thơm mềm**\nBạn thái 200gr thịt thăn bò thành miếng vừa ăn dày khoảng 0.5cm, sau đó cắt sợi. Ướp bò với 1 muỗng canh hạt nêm, tiêu, tỏi băm và một ít dầu ăn để khóa ẩm. Sau 30 phút, bạn bắc chảo lên bếp với chút dầu ăn, vặn lửa thật lớn rồi cho bò vào xào nhanh tay cho săn lại và không bị ra nước thì tắt bếp, trút ra đĩa để thật nguội.\n\n**Bước 4: Chế biến miến, trứng và rau củ**\nBạn đun sôi một nồi nước, cho miến vào chần từ 7 - 8 phút đến khi sợi miến bấm được lõi nhưng không bị nhão thì vớt ra rổ ráo nước. Dùng kéo cắt miến cho bớt dài rồi trộn ngay với 2 muỗng canh dầu ăn và 2 muỗng canh nước sốt đã làm để sợi miến bóng, không dính. Trứng gà bạn đánh tan cùng bột bắp hòa chút nước, đem chiên thật mỏng rồi cắt sợi. Cải bó xôi chần trong 1 phút rồi ngâm nước lạnh. Cà rốt chần nhanh trong 10 giây rồi vớt ra.\n\n**Bước 5: Trộn miến thập cẩm**\nBạn cho cải bó xôi, cà rốt, trứng cắt sợi, miến và thịt bò vào một thố lớn. Bạn rưới thêm 3 muỗng canh nước sốt vào và trộn đều bằng tay cho thấm. Cuối cùng, bạn cho thêm ớt sừng sợi, ngò rí, mè rang và một ít hạt tiêu vào, tiếp tục trộn đều cho các nguyên liệu hòa quyện. Để tăng thêm hương vị ẩm thực Việt Nam, bạn có thể cho thêm giò lụa thái chỉ, tôm tươi hấp hoặc lạc rang giã nhỏ tùy ý.\n\n**Bước 6: Thành phẩm**\nSợi miến tơi mềm, dai ngon, thấm đẫm nước sốt xì dầu và dầu hào đậm đà cùng các loại rau củ giòn ngọt và thịt bò mềm thơm. Món ăn có màu sắc bắt mắt, rất thích hợp để đổi vị cho bữa ăn mà không lo bị ngán hay tăng cân.	20	20	2	Hard	Published	33cbe291-2ee0-4fef-bbd9-310770c0ef54	7d581264-5002-4f9d-823b-11f89ddbbb9b	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	304
15585d4c-c42e-557c-8e7b-d8634962b224	Bê hấp tía tô thơm ngon, thịt mềm ngọt không bị hôi cực đơn giản	be-hap-tia-to-thom-ngon-thit-mem-ngot-khong-bi-hoi-cuc-don-g	Bạn đang tìm cách làm bê hấp tía tô thơm ngon, chuẩn vị? Vào bếp ngay với công thức thịt bê hấp tía tô này! Món hấp này không chỉ giữ trọn vị ngọt tự nhiên của thịt bê tươi mà còn dậy mùi sả gừng, lá tía tô hấp dẫn. Đảm bảo bạn sẽ có ngay món ăn chiêu đãi cả nhà!	### Hướng dẫn cách nấu: Bê hấp tía tô thơm ngon, thịt mềm ngọt không bị hôi cực đơn giản\n\n**Bước 1: Sơ chế và khử mùi thịt bê tươi ngon**\nĐầu tiên, bạn cho 1kg thịt bê vào bát lớn cùng với một ít muối hạt và 1 muỗng canh rượu gừng (hoặc rượu trắng). Dùng tay bóp và chà xát thật kỹ lên bề mặt da cũng như phần thịt bê để loại bỏ hoàn toàn mùi đặc trưng. Sau đó, rửa sạch lại thịt bê dưới vòi nước rồi để ráo.\n\n**Bước 2: Sơ chế các nguyên liệu thơm**\nVới sả, bạn bóc lớp vỏ già bên ngoài, rửa sạch để lót nồi hấp. Lấy khoảng 3 - 4 nhánh sả nhỏ xắt lát mỏng để ướp thịt, phần còn lại đập dập và cắt khúc. Gừng và riềng đem rửa sạch, đập dập; một nửa băm nhỏ để chuẩn bị ướp thịt, một nửa để nguyên miếng để lót xửng hấp. Ớt cay băm nhỏ, ớt sừng xắt sợi. Lá tía tô và các loại rau ăn kèm rửa sạch và để ráo nước.\n\n**Bước 3: Ướp thịt bê đậm đà**\nBạn cho 1kg thịt bê vào tô lớn, nêm vào 1/2 muỗng canh hạt nêm, 1/2 muỗng canh đường, một ít bột ngọt, tiêu xay và 1 muỗng canh dầu hào. Tiếp theo, cho sả xắt lát, gừng băm, riềng băm và ớt băm vào. Đeo bao tay, bóp trộn đều gia vị lên từng miếng thịt và để thịt nghỉ trong khoảng 20 - 30 phút cho thấm đậm đà.\n\n**Bước 4: Cuộn thịt và chuẩn bị nồi hấp**\nBạn dùng dây chỉ thực phẩm cuộn thật chặt các tảng thịt bê lại để miếng thịt định hình tròn đẹp khi chín. Bạn chuẩn bị nồi hấp, đổ nước vào đáy nồi sao cho lượng nước bằng khoảng 1/2 khoảng cách từ đáy đến xửng. Tiếp theo, bạn cho bẹ sả già, sả cắt khúc, gừng và riềng đập dập trực tiếp vào phần nước này rồi đun sôi để tạo hơi nước thơm.\n\n**Bước 5: Hấp thịt bê**\nKhi nước trong nồi đã sôi và bốc hơi thơm, bạn đặt xửng hấp lên, xếp các cuộn thịt bê vào. Bạn đậy nắp và hấp ở lửa vừa trong khoảng 20 phút. Khi thịt đã chín tới, bạn mở nắp, xếp toàn bộ lá tía tô phủ kín lên trên mặt thịt rồi đậy nắp hấp thêm khoảng 3 phút nữa cho tinh dầu tía tô thấm đượm vào thịt bê là có thể tắt bếp.\n\n**Bước 6: Pha nước chấm tương bần chuẩn vị**\nTrong lúc đợi thịt chín, bạn tiến hành pha nước chấm. Cho 2 muỗng canh tương bần vào bát, thêm 1 muỗng canh đường và 1/2 muỗng cà phê bột ngọt rồi khuấy đều cho tan hoàn toàn. Sau cùng, cho gừng băm, ớt băm và đậu phộng rang giã nhỏ vào trộn đều là hoàn thành nước chấm chuẩn vị.\n\n**Bước 7: Thái thịt và trình bày thành phẩm**\nLấy thịt bê ra đĩa, để nguội hẳn rồi mới tháo dây chỉ và thái thành những miếng mỏng vừa ăn. Bày thịt ra mẹt hoặc đĩa cùng với bún, bánh tráng và các loại rau củ đã sơ chế. Bạn có thể rắc thêm một ít mè rang và vài sợi ớt sừng lên trên cho bắt mắt.\n\n**Bước 8: Thành phẩm**\nMón bê hấp tía tô đạt yêu cầu khi thịt bê chín mềm, giữ được vị ngọt tự nhiên, phần bì giòn sần sật và dậy mùi thơm đặc trưng của sả, gừng, tía tô. Khi cuốn thịt cùng bánh tráng, rau sống và chấm nước tương bần đậm đà, vị béo bùi của đậu phộng sẽ khiến món ăn trở nên vô cùng hấp dẫn.	30	25	4	Hard	Published	33cbe291-2ee0-4fef-bbd9-310770c0ef54	1c7a1ddf-c7eb-4029-8fe4-49f5ea29a8b0	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	199
b7389d5f-1c77-593c-b5c6-bc16e531af2d	Bún bò trộn thơm ngon, đậm đà đơn giản tại nhà	bun-bo-tron-thom-ngon-dam-da-don-gian-tai-nha	Bạn mê mẩn món bún bò trộn thơm ngon, chuẩn vị nhưng chưa biết cách làm? Đừng lo! Vào bếp sẽ chia sẻ công thức làm bún trộn thịt bò cực đơn giản để bạn có thể làm ngay tại nhà. Cùng thực hiện món từ bò hấp dẫn này nhé!	### Hướng dẫn cách nấu: Bún bò trộn thơm ngon, đậm đà đơn giản tại nhà\n\n**Bước 1: Làm hành phi giòn rụm**\nHành tím 50gr rửa sạch, thái mỏng. Cho dầu ăn vào chảo, đun nóng già (kiểm tra bằng cách thả một lát hành vào, nếu hành nổi lên và sôi mạnh là được). Cho hết hành vào, phi ở lửa lớn đến khi hành chuyển sang màu vàng nhạt khoảng 80%. Vớt hành ra rây lọc dầu ngay lập tức. Hành còn nóng sẽ tiếp tục vàng thêm, nên đừng phi quá vàng để tránh bị cháy. Hành phi đạt yêu cầu sẽ giòn tan và thơm lừng.\n\n**Bước 2: Sơ chế và làm đồ chua cà rốt đu đủ**\nĐu đủ xanh 150gr và cà rốt 150gr gọt vỏ, rửa sạch, bào sợi nhỏ. Cho cà rốt và đu đủ vào tô, thêm 2 muỗng canh đường và 2 muỗng canh dấm. Trộn đều và ướp trong khoảng 15-20 phút để đồ chua được giòn và ngấm vị.\n\n**Bước 3: Ướp thịt bò xào thơm lừng**\nTỏi 40gr bóc vỏ, đập dập và băm nhỏ. Ớt 1 quả băm nhỏ. Thịt bò 200gr thái thành các miếng mỏng vừa ăn. Ướp thịt bò với 1 thìa cà phê dầu hào, 1/2 thìa cà phê hạt nêm, một chút tiêu và một phần tỏi băm. Trộn đều và ướp trong khoảng 10 phút cho thịt ngấm gia vị.\n\n**Bước 4: Chuẩn bị lạc rang và các loại rau sống ăn kèm**\nLạc rang 100gr (đậu phộng) giã dập sau khi đã rang chín và tách vỏ. Giá đỗ 100gr rửa sạch, để ráo nước. Rau xà lách, rau húng, rau mùi rửa sạch, để ráo. Xà lách thái khúc vừa ăn.\n\n**Bước 5: Pha nước mắm chua ngọt chuẩn vị**\nTrong một tô, cho 2 muỗng canh nước mắm, 2 muỗng canh đường, 1 muỗng canh dấm. Thêm 4-6 muỗng canh nước nóng (tùy độ đậm nhạt của nước mắm bạn dùng). Khuấy đều cho đường tan hết. Khi nước mắm đã nguội, cho 1/2 lượng tỏi băm còn lại và ớt băm vào.\n\n**Bước 6: Xào thịt bò và giá đỗ**\nCho 1 muỗng canh dầu ăn (có thể dùng dầu phi hành để món ăn thơm hơn) vào chảo. Phi thơm phần tỏi băm còn lại. Khi tỏi thơm, cho thịt bò đã ướp vào xào nhanh trên lửa lớn. Xào đến khi thịt bò chín tái thì cho giá đỗ vào, đảo đều cho giá vừa chín tới. Vì thịt bò đã ướp gia vị nên không cần nêm thêm. Tắt bếp ngay khi thịt và giá vừa chín để giữ độ mềm ngọt và giòn.\n\n**Bước 7: Hoàn thành tô bún bò trộn hấp dẫn**\nCho một ít rau xà lách thái khúc xuống đáy tô. Tiếp theo, cho khoảng 200-250gr bún tươi lên trên. Xếp thịt bò xào giá, đồ chua (cà rốt, đu đủ), rau sống ăn kèm (húng, mùi), lạc rang và hành phi lên trên.\n\n**Bước 8: Thành phẩm**\nKhi thưởng thức, bạn chỉ cần rưới phần nước mắm chua ngọt đã pha lên trên, trộn đều và tận hưởng hương vị tuyệt vời của món bún bò trộn. Vị chua ngọt cay cay của nước mắm hòa quyện cùng bún dai, thịt bò mềm thơm, đồ chua giòn sần sật, rau sống thanh mát và lạc rang, hành phi bùi béo sẽ khiến bạn mê mẩn!	30	20	4	Hard	Published	33cbe291-2ee0-4fef-bbd9-310770c0ef54	7c46cda2-3fd0-431a-894f-c0b15881fbfb	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	132
bdc54bd9-2643-5f8c-ba0e-84d55edb94fc	Canh chua cá ngừ thơm ngon không tanh, chuẩn vị miền Trung tại nhà	canh-chua-ca-ngu-thom-ngon-khong-tanh-chuan-vi-mien-trung-ta	Bạn đang muốn trổ tài với món cá ngừ nấu canh chua cho cả nhà thưởng thức? Hãy cùng Vào bếp khám phá ngay cách làm món canh không chỉ thơm ngon, mà còn vô cùng bổ dưỡng, kích thích vị giác này nhé!	### Hướng dẫn cách nấu: Canh chua cá ngừ thơm ngon không tanh, chuẩn vị miền Trung tại nhà\n\n**Bước 1: Sơ chế và ướp cá ngừ**\nGiã nhuyễn đầu hành trắng, ớt hiểm, ớt bột, muối và hạt nêm. Ướp hỗn hợp này vào cá trong 5 phút để cá thấm vị và khử mùi tanh cá hiệu quả.\n\n**Bước 2: Sơ chế rau củ**\nCà chua cắt múi cau, thơm cắt lát dày khoảng 5 đến 7 ly. Hành lá cắt khúc, sả cây đập dập rồi cắt khúc.\n\n**Bước 3: Xào cá và nấu canh chua**\nPhi thơm sả, hành tỏi băm với dầu điều, cho cá vào xào săn. Thêm 1.2 lít nước sôi, nêm gia vị, cho thơm và cà chua vào nấu chín. Cuối cùng cho bắp chuối bào, hành lá và một muỗng canh nước mắm rồi tắt bếp.\n\n**Bước 4: Thành phẩm**\nMón canh có màu sắc bắt mắt, vị chua ngọt hài hòa, thịt cá ngừ tươi ngon không bị bở, dùng kèm với cơm nóng hoặc bún đều rất tuyệt.	15	15	4	Easy	Published	5d3acf4a-1672-4654-8d90-9118a6ee06ba	078bf482-fe40-4efb-9281-4ae88d007f46	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	100
6faa4818-6400-5edd-9816-77b5450e8ed6	Phật nhảy tường đại bổ chuẩn vị nhà hàng cực dễ cho cả gia đình	phat-nhay-tuong-dai-bo-chuan-vi-nha-hang-cuc-de-cho-ca-gia-d	Bạn muốn thử sức với món Phật nhảy tường trứ danh của ẩm thực Phúc Kiến? Cùng Vào bếp thực hiện món canh đại bổ này với công thức chuẩn vị nhà hàng. Bài viết sẽ giúp bạn chinh phục món hầm bổ dưỡng này ngay tại nhà cực đơn giản.	### Hướng dẫn cách nấu: Phật nhảy tường đại bổ chuẩn vị nhà hàng cực dễ cho cả gia đình\n\n**Bước 1: Sơ chế bào ngư và hải sản**\nBạn đun sôi một nồi nước, thêm hành lá và vài lát gừng vào rồi cho bào ngư vào luộc sơ. Sau khi bào ngư nguội, bạn tiến hành tách lấy phần thịt ra khỏi vỏ để riêng.\n\n**Bước 2: Chuẩn bị hải sâm và vi cá**\nBạn đun ấm nước khoảng 20 độ C cùng hành lá và gừng, cho 3 con hải sâm vào, bọc kín và để vào ngắn mát tủ lạnh, ngâm liên tục trong 3 ngày để hải sâm nở to. Miếng vi cá, bạn cũng ngâm trong nước, bọc kín và để trong tủ lạnh 4 ngày. Lưu ý: Nước ngâm hải sâm và vi cá phải sạch, không dính dầu mỡ để tránh nguyên liệu bị hỏng.\n\n**Bước 3: Xử lý sò điệp, nấm đông cô và giăm bông**\nBạn lấy 100gr sò điệp khô đem ngâm trong nước ấm pha một ít rượu trắng trong 1 ngày. Với 100gr nấm đông cô khô, bạn ngâm trong nước ấm 1 đêm trước ngày nấu cho nở mềm. Đối với 200gr thịt giăm bông, bạn dùng dao cắt thành các lát mỏng vừa ăn.\n\n**Bước 4: Nấu nước dùng chuẩn vị**\nBạn chuẩn bị một chiếc nồi lớn, cho vào 1 con gà và xương heo (gà và xương heo đã trụng nước sôi và rửa sạch). Tiếp tục thêm 20gr tiêu sọ trắng, 10gr trần bì và châm nước nóng vào cho ngập phần thịt gà và xương heo. Bạn hầm nồi nước dùng này liên tục trong 1 ngày 1 đêm ở lửa nhỏ để chắt lấy phần nước cốt tinh túy nhất. Mẹo nhỏ: Nếu không có nhiều thời gian, bạn có thể hầm nước dùng gà và nước dùng xương heo bằng nồi áp suất sẽ tiết kiệm thời gian hơn.\n\n**Bước 5: Xếp nguyên liệu vào thố sứ và chuẩn bị hấp**\nBạn xếp tất cả các nguyên liệu gồm bào ngư, hải sâm, nấm, sò điệp, vi cá, giăm bông vào trong một chiếc âu sứ. Tiếp theo, bạn thêm vào một ít rượu trắng và đổ nước dùng gà vừa hầm vào cho ngập mặt.\n\n**Bước 6: Nấu chậm bằng cách chưng cách thủy**\nBạn dùng màng bọc thực phẩm bọc thật kín miệng thố sứ, đậy nắp lại rồi đem hấp cách thủy trong 1 ngày 1 đêm thì món ăn sẽ giữ được giá trị dinh dưỡng cũng như hương vị hấp dẫn nhất.\n\n**Bước 7: Thành phẩm**\nMón Phật nhảy tường hoàn thành có nước dùng ngọt thanh cùng màu vàng óng ả, mùi hương thơm lừng cả căn bếp. Bào ngư, vi cá và hải sâm chín mềm mại, hòa quyện cùng mùi thơm đặc trưng của nấm và trần bì tạo nên một món ăn có hương vị khó quên.	60	1439	4	Hard	Published	5d3acf4a-1672-4654-8d90-9118a6ee06ba	573f12df-dbdb-40b0-82f9-bd52ca5c972c	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	302
e3438f8e-7aca-5d17-b956-236640ed480e	Món bồng khoai nấu ốc om cơm mẻ chuẩn vị miền Bắc cực đơn giản	mon-bong-khoai-nau-oc-om-com-me-chuan-vi-mien-bac-cuc-don-gi	Món bồng khoai nấu ốc là hương vị quê hương khó quên trong lòng nhiều người. Cùng Vào bếp thực hiện món canh bồng khoai nấu ốc đậm đà với cơm mẻ và mắm tôm. Bài viết này sẽ giúp bạn sơ chế bồng khoai không bị ngứa, đảm bảo thành công ngay lần đầu.	### Hướng dẫn cách nấu: Món bồng khoai nấu ốc om cơm mẻ chuẩn vị miền Bắc cực đơn giản\n\n**Bước 1: Sơ chế nguyên liệu**\nBạn ngâm ốc với sả, ớt và nước vo gạo trong một buổi sáng cho sạch rồi rửa lại lần nữa. Cắt 300gr bồng khoai thành các khúc vừa ăn, phần đầu trên to thì chẻ làm đôi. Chẻ 1 quả cà chua thành các múi cau. Rau ngổ và mùi tàu đem cắt khúc. Hành khô (hành tím), tỏi và gừng bạn đem đập dập rồi băm nhỏ.\n\n**Bước 2: Luộc và khêu thịt ốc**\nĐun sôi nồi nước với chút muối, giấm, gừng đập dập, sả cắt khúc và ớt sừng. Khi nước sôi, cho ốc vào luộc và đảo liên tục để ốc bung mài. Lưu ý vớt bọt trong quá trình luộc để nước dùng được trong. Sau khi nước sôi khoảng 3 - 5 phút, vớt ốc ra để nguội rồi dùng tăm khêu lấy phần ruột ốc béo ngậy.\n\n**Bước 3: Xào ruột ốc và ngó khoai**\nBắc nồi lên bếp, phi thơm hành tỏi băm rồi cho phần ruột ốc vào xào sơ qua cho săn lại. Kế đến, bạn cho cà chua đã chẻ múi cau và 300gr bồng khoai vào xào chung, đảo đều tay để nguyên liệu thấm dầu và hương thơm của hành tỏi.\n\n**Bước 4: Nấu canh ốc với bồng khoai**\nNêm vào nồi 1/3 muỗng canh bột nêm, 1 chút đường, 1/4 muỗng canh nước mắm và 1 vá nhỏ cơm mẻ. Để món ăn có màu đẹp, bạn có thể cho thêm bột nghệ (hoặc nghệ tươi giã lấy nước), mắm tôm và tiêu xay. Đảo đều cho gia vị thấm rồi cho nước luộc ốc vào. Đun sôi với lửa lớn, sau đó hạ nhỏ lửa và om trong khoảng 5 phút để ngó khoai chín mềm.\n\n**Bước 5: Thành phẩm**\nNêm nếm lại cho vừa ăn theo khẩu vị gia đình rồi cho rau ngổ, mùi tàu (có thể thêm tía tô, lá lốt nếu thích) cắt khúc vào, sau đó tắt bếp. Món ốc nấu bồng khoai là món ăn dân dã có màu vàng bắt mắt, nước dùng chua thanh vị mẻ, ruột ốc giòn sần sật kết hợp cùng ngó khoai mềm ngọt, thơm nồng mùi mắm tôm đặc trưng.	30	15	3	Hard	Published	5d3acf4a-1672-4654-8d90-9118a6ee06ba	456e6fad-7dc8-4695-8063-23bf6e2c73f3	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	145
2070da0c-204a-5f14-acfd-36c149358124	Canh măng mực Bát Tràng với bí quyết nấu thơm ngon, chuẩn vị xưa	canh-mang-muc-bat-trang-voi-bi-quyet-nau-thom-ngon-chuan-vi-	Chào các bạn yêu bếp! Hôm nay, Vào bếp sẽ chia sẻ bí quyết nấu canh măng mực Bát Tràng trứ danh, một món nước truyền thống đậm đà hương vị. Tuy cầu kỳ nhưng thành quả sẽ khiến bạn tự hào. Cùng khám phá món canh truyền thống Bát Tràng này nhé!	### Hướng dẫn cách nấu: Canh măng mực Bát Tràng với bí quyết nấu thơm ngon, chuẩn vị xưa\n\n**Bước 1: Sơ chế măng khô**\nMăng khô đem ngâm với nước trong khoảng 8 tiếng hoặc qua đêm để măng mềm hơn. Sau khi ngâm, dùng dao nhỏ tước măng thành những sợi thật nhỏ. Sợi măng càng nhỏ thì khi xào sẽ càng ngấm gia vị và ngấu hơn.\n\n**Bước 2: Luộc măng loại bỏ độc tố**\nĐun sôi một nồi nước lớn, cho măng đã tước sợi vào luộc. Luộc măng khoảng 7 đến 8 lần. Mỗi lần luộc khoảng 5 phút. Sau mỗi lần luộc, vớt măng ra rổ và rửa sạch dưới vòi nước chảy để loại bỏ nước đục và chất độc. Lặp lại cho đến khi nước luộc măng thật trong.\n\n**Bước 3: Sơ chế mực khô**\nMực khô rửa sạch, sau đó ngâm với một chút rượu trắng và vài lát gừng để khử mùi tanh hôi. Sau khi ngâm, xé mực thành những sợi nhỏ vừa ăn.\n\n**Bước 4: Xào măng ngấm gia vị**\nĐặt chảo lên bếp, cho mỡ lợn vào đun nóng. Khi mỡ bắt đầu sôi lăn tăn, cho măng đã luộc sạch vào xào. Thỉnh thoảng, thêm một chút nước dùng gà vào để măng ngấu và hấp thụ hết vị ngọt của nước dùng. Nêm vào chảo 1 ít muối, 1 ít đường và 1 ít nước mắm. Đảo đều tay cho đến khi măng săn lại và ngấm đều gia vị.\n\n**Bước 5: Xào mực thơm lừng**\nTrong một chảo khác, tiếp tục cho mỡ lợn và mực đã xé sợi vào chảo xào. Đảo đều trên lửa vừa, tránh để lửa quá to làm mực bị cháy. Nêm thêm 1 ít muối, 1 ít đường và 1 ít nước dùng gà. Xào cho đến khi sợi mực mềm hơn, săn lại và dậy mùi thơm.\n\n**Bước 6: Xào chung và ninh canh măng mực**\nCho măng đã xào vào chảo mực, đảo đều để măng và mực quyện vào nhau. Thêm một chút nước dùng gà nữa để các nguyên liệu hòa quyện. Tiếp tục xào cho đến khi sợi măng và mực săn lại, chuyển sang màu cánh gián đẹp mắt. Đây là khâu quan trọng để tạo độ ngấu và hương vị đặc trưng cho món ăn. Sau đó, đổ nước dùng gà vào chảo, đun sôi rồi hạ nhỏ lửa, ninh khoảng 45 phút cho măng và mực thật mềm, thấm vị.\n\n**Bước 7: Thành phẩm**\nMúc canh măng mực Bát Tràng ra bát. Món ăn này đặc biệt ở chỗ không cần thêm bất cứ loại rau gia vị nào để giữ trọn hương vị mộc mạc, thuần khiết nhất. Thưởng thức khi còn nóng.	30	120	4	Hard	Published	5d3acf4a-1672-4654-8d90-9118a6ee06ba	98ec81e8-21ab-41be-a3f2-cdf05dfcc8b5	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	185
afbf12f7-653a-5f1e-9a88-181afe8c6d76	Thịt băm kho trứng cút đậm đà, cực hao cơm cho sinh viên tại nhà	thit-bam-kho-trung-cut-dam-da-cuc-hao-com-cho-sinh-vien-tai-	Hôm nay hãy cùng vào bếp với Điện máy XANH để thực hiện một món kho vô cùng hấp dẫn và tiết kiệm chính là thịt băm kho trứng cút. Với hương vị đậm đà, món ăn này chắc chắn sẽ khiến nồi cơm nhà bạn hết veo trong nháy mắt.	### Hướng dẫn cách nấu: Thịt băm kho trứng cút đậm đà, cực hao cơm cho sinh viên tại nhà\n\n**Bước 1: Luộc và sơ chế trứng cút**\nBạn cho 30 quả trứng cút vào nồi nước, bắc lên bếp luộc chín trong khoảng 5 phút. Sau khi trứng chín, bạn vớt ra cho vào bát nước lạnh để nguội bớt.\n\n**Bước 2: Xay thịt lợn xay**\nBạn chuẩn bị 300gr thịt heo, rửa sạch và cắt nhỏ. Sau đó, bạn cho thịt vào máy xay và tiến hành xay cho đến khi thịt nhuyễn là được.\n\n**Bước 3: Pha nước sốt mặn ngọt**\nBạn chuẩn bị một cái bát, cho vào các gia vị gồm: 100ml nước lọc, 4 muỗng canh nước mắm truyền thống, 3 muỗng canh đường, 2 muỗng canh tương ớt và 1 muỗng canh ớt bột. Bạn dùng muỗng khuấy thật đều để các gia vị hòa quyện vào nhau.\n\n**Bước 4: Chiên trứng cút rim thịt băm**\nBạn bắc chảo lên bếp với một ít dầu ăn, khi dầu nóng thì cho phần trứng cút đã lột vỏ vào. Bạn chiên trứng với lửa vừa, đảo nhẹ tay cho đến khi lớp vỏ ngoài của trứng vàng đều và săn lại thì vớt ra đĩa.\n\n**Bước 5: Kho thịt băm rim trứng cút**\nBạn sử dụng lại chảo đó, phi thơm tỏi và ớt băm. Tiếp theo, bạn cho thịt heo đã xay vào đảo đều tay cho đến khi thịt săn lại. Lúc này, bạn đổ phần nước sốt đã pha vào đun sôi, sau đó cho trứng cút đã chiên vào. Bạn đảo đều gia vị, kho cho đến khi nước sốt sệt lại, thấm đều vào trứng và thịt thì rắc thêm hành lá cắt nhỏ và ít hạt tiêu xay lên trên rồi tắt bếp.\n\n**Bước 6: Thành phẩm**\nMón mặn ăn cơm này hoàn thành có màu sắc bắt mắt, trứng cút vàng ươm thấm vị cay mặn ngọt, thịt băm mềm béo hòa quyện cùng nước sốt đậm đà. Đây là món ngon mỗi ngày cực kỳ lý tưởng khi dùng kèm với cơm trắng nóng hổi.	15	20	2	Easy	Published	c73c5844-5458-4613-ae07-7f00e368457f	a343771d-bafb-4a55-9459-2739d0b00a20	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	124
96927fef-8c57-5362-8093-f3f0e230d69a	Cá trắm kho khế chua đậm đà thơm ngon đưa cơm cho cả gia đình	ca-tram-kho-khe-chua-dam-da-thom-ngon-dua-com-cho-ca-gia-din	Cùng Vào bếp thực hiện món cá trắm kho khế chua dân dã cho bữa cơm gia đình. Món kho này kết hợp thịt ba chỉ béo ngậy cùng vị chua thanh của khế, giúp khử mùi tanh cá hiệu quả. Đảm bảo bạn sẽ có nồi cá kho khế chua chuẩn vị miền Bắc cực kỳ hấp dẫn.	### Hướng dẫn cách nấu: Cá trắm kho khế chua đậm đà thơm ngon đưa cơm cho cả gia đình\n\n**Bước 1: Sơ chế nguyên liệu**\nBạn đem gừng và riềng miếng gọt sạch vỏ, rửa với nước rồi thái thành từng lát mỏng. Với khế chua, bạn rửa sạch, cắt bỏ phần rìa các cạnh và cuống, sau đó thái thành lát mỏng khoảng 1cm vừa ăn để món cá trắm nấu khế chua thêm phần đẹp mắt.\n\n**Bước 2: Sơ chế và tẩm ướp cá**\nBạn rửa sạch cá trắm và thịt ba chỉ với muối và giấm để khử mùi tanh cá hoàn toàn, sau đó xả lại nước sạch. Tiếp theo, bạn cho cá và thịt vào tô lớn, nêm vào 3 thìa nước mắm, 1 thìa hạt nêm, 1/2 thìa mì chính, 1.5 thìa đường, 1 thìa gia vị, 1 thìa hạt tiêu và 3 thìa nước hàng. Bạn dùng tay bóp nhẹ và trộn đều các gia vị kho cá, sau đó để cá ướp trong vòng 1 tiếng cho thấm đều.\n\n**Bước 3: Kho cá**\nBạn chuẩn bị một chiếc nồi lớn, lần lượt xếp toàn bộ gừng và riềng miếng thái lát xuống dưới đáy nồi. Tiếp theo, bạn xếp một lớp khế chua lên trên. Cuối cùng, bạn lần lượt xếp thịt ba chỉ và các khúc cá trắm đã ướp vào nồi, sau đó đổ toàn bộ phần nước ướp cá còn dư trong tô lên phía trên cùng. Bạn đặt nồi lên bếp, cho thêm 2 quả ớt lên trên mặt cá, đậy vung và đun ở lửa to. Khi nước sôi, bạn chăm thêm nước nóng cho nước ngập xăm xắp mặt cá, đun cho nước sôi lại rồi hạ nhỏ lửa. Tiến hành kho cá với khế trong khoảng 1.5 tiếng để thịt cá chắc lại và thấm màu nâu cánh gián. Trong quá trình kho, nếu thấy nước quá cạn, bạn có thể cho thêm một ít nước nóng để cá chín mềm và không bị cháy đáy nồi.\n\n**Bước 4: Thành phẩm**\nMón cá trắm kho khế chua sau khi hoàn thành có màu nâu vàng óng ả bắt mắt. Miếng cá săn chắc, đậm đà quyện với vị béo ngậy của thịt ba chỉ và vị chua thanh đặc trưng của khế, ăn kèm với cơm trắng nóng hổi trong bữa cơm gia đình thì không gì bằng.	30	90	4	Hard	Published	c73c5844-5458-4613-ae07-7f00e368457f	852cc4dc-913d-4d95-8962-4c5407d77d3c	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	193
a6f8bcda-1250-5c08-bcbe-08addf0bf64d	Cá kho dưa chua miền Bắc chuẩn vị dân dã cực đưa cơm cho cả nhà	ca-kho-dua-chua-mien-bac-chuan-vi-dan-da-cuc-dua-com-cho-ca-	Thời tiết chuyển mùa thu đông là lúc lý tưởng để bạn vào bếp cùng Điện máy XANH trổ tài thực hiện món kho đậm đà. Trong đó, cá kho dưa chua miền Bắc với vị chua thanh, cá nhừ xương, thịt béo ngậy chắc chắn sẽ là linh hồn của mâm cơm gia đình, gợi nhớ hương vị quê hương khó quên.	### Hướng dẫn cách nấu: Cá kho dưa chua miền Bắc chuẩn vị dân dã cực đưa cơm cho cả nhà\n\n**Bước 1: Sơ chế cá và thịt ba chỉ**\nCá diếc mua về bạn đánh vảy, mổ moi ruột và làm sạch. Bạn cho 10gr muối hạt vào cá, đảo đều và để ngấm trong khoảng 60 phút cho thịt cá cứng lại, lưu ý không rửa lại nước sau khi ướp. Thịt ba chỉ bạn rửa sạch, xắt miếng vừa ăn. Hành khô bóc vỏ bổ đôi, ớt bỏ núm để nguyên quả. Dưa cải muối chua bạn rửa sơ qua nước để giảm độ mặn.\n\n**Bước 2: Pha hỗn hợp nước kho đậm đà**\nBạn chuẩn bị một chiếc tô lớn, cho vào 800ml nước sôi và 200ml nước dưa chua. Sau đó, bạn nêm tiếp 1/2 thìa canh muối tinh, 1 thìa canh mì chính, 1 thìa canh hạt nêm, 1/2 thìa canh tiêu bột (nên dùng hạt tiêu Bắc cho thơm), 1 thìa canh đường, 5 thìa canh nước mắm truyền thống và khoảng 6 thìa nước hàng cốt dừa rồi khuấy đều.\n\n**Bước 3: Xếp nguyên liệu vào nồi**\nBạn rải khoảng 300gr dưa chua xuống đáy nồi trước để tránh cháy cá, sau đó xếp một nửa số thịt ba chỉ lên trên. Tiếp đến, bạn xếp toàn bộ 1kg cá diếc đã ướp muối vào nồi. Sau cùng, bạn phủ nốt phần dưa chua, thịt ba chỉ còn lại cùng hành khô và ớt lên trên mặt cá. Nếu có củ riềng già, bạn có thể cắt lát lót dưới đáy nồi để tăng hương vị.\n\n**Bước 4: Kỹ thuật kho cá nhừ xương**\nBạn đổ từ từ hỗn hợp nước kho đã pha vào nồi sao cho nước ngập mặt các nguyên liệu. Bạn đóng nắp nồi, đun sôi rồi hạ thật nhỏ lửa để cá sôi lăn tăn. Tiến hành kho cá từ 3 - 6 tiếng cho đến khi nước cạn hẳn và cá nhừ xương. Để món ăn ngon nhất, bạn nên kho hai lửa (đun cạn lần một, để nguội rồi kho tiếp) cho đến khi cá săn chắc và dưa mềm nhừ.\n\n**Bước 5: Thành phẩm**\nMón cá nấu dưa chua miền Bắc đạt chuẩn khi cá vẫn nguyên con nhưng xương nhừ tan, thịt cá chắc thấm vị chua dịu của dưa và béo ngậy của mỡ lợn. Dưa chua thấm mỡ cá giòn ngon, màu nâu cánh gián bắt mắt, dậy mùi thơm của hành khô và tiêu. Đây sẽ là món ngon đưa cơm trong những ngày se lạnh mà bạn không thể bỏ qua.	70	240	4	Hard	Published	c73c5844-5458-4613-ae07-7f00e368457f	cc06a093-474f-4659-9db0-ed4c708e2978	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	168
c35b1123-1f4e-54ca-8d53-7bd26828403b	Thịt xá xíu bằng gói gia vị Cholimex mềm ngon, chuẩn vị tại nhà	thit-xa-xiu-bang-goi-gia-vi-cholimex-mem-ngon-chuan-vi-tai-n	Hôm nay, Điện máy XANH sẽ cùng bạn vào bếp thực hiện một món kho mang đậm phong cách người Hoa vô cùng hấp dẫn. Với cách làm thịt xá xíu bằng gói gia vị Cholimex cực kỳ đơn giản này, bạn sẽ dễ dàng có được những miếng thịt mềm mọng, óng ả và thấm vị để chiêu đãi cả gia đình.	### Hướng dẫn cách nấu: Thịt xá xíu bằng gói gia vị Cholimex mềm ngon, chuẩn vị tại nhà\n\n**Bước 1: Sơ chế thịt heo**\nThịt heo mua về bạn mang đi rửa thật sạch với hỗn hợp nước giấm và muối để khử sạch mùi hôi, sau đó để thịt thật ráo nước. Dùng dao cắt khối thịt thành những miếng dài và dày vừa phải để khi rim thịt nhanh chín hơn. Tiếp theo, bạn sử dụng một chiếc nĩa để châm đều lên khắp các bề mặt của miếng thịt. Công đoạn này giúp thịt nhanh ngấm nước sốt và khi hoàn thành sẽ mềm mại hơn.\n\n**Bước 2: Cách ướp thịt xá xíu đậm đà**\nBạn chuẩn bị một chiếc tô lớn, cho vào 1 muỗng canh đường, 1 muỗng canh hạt nêm, 1/2 muỗng cà phê bột ngọt, 1 muỗng canh nước tương và 1 muỗng canh dầu hào. Tiếp tục thêm 1 muỗng canh rượu mai quế lộ, 1 muỗng cà phê bột màu điều tạo màu thực phẩm đỏ cam, 1/3 muỗng cà phê bột ngũ vị hương và hành tím, tỏi băm. Cuối cùng, bạn cho 2 gói gia vị vào trộn đều rồi cho thịt vào xoa bóp kỹ, để thịt nghỉ ít nhất 1 tiếng cho ngấm vị.\n\n**Bước 3: Rim thịt xá xíu bằng chảo**\nBạn bắc chảo lên bếp, cho 2 muỗng canh dầu ăn vào phi thơm một ít tỏi băm rồi gắp các miếng thịt đã ướp vào áp chảo ở lửa nhỏ cho đến khi các mặt săn lại. Tiếp theo, bạn đổ toàn bộ phần nước ướp thịt còn sót lại vào chảo cùng 1 chén nước dừa tươi. Bạn rim thịt ở lửa nhỏ và thường xuyên trở đều các mặt cho đến khi nước sốt cạn dần, sánh sệt lại và tạo thành một lớp màng óng bao quanh miếng thịt thì tắt bếp.\n\n**Bước 4: Thành phẩm**\nĐợi thịt nguội bớt rồi dùng dao cắt thành từng lát mỏng vừa ăn. Thịt xá xíu sau khi hoàn thành có màu sắc cực kỳ bắt mắt và bóng mượt, thớ thịt mềm mại không bị khô. Món ăn thấm đẫm vị mặn ngọt hài hòa, thơm nồng nàn mùi rượu mai quế lộ. Bạn có thể dùng món này để làm cơm xá xíu, bánh mì xá xíu hoặc ăn kèm hủ tiếu đều vô cùng chuẩn vị.	10	50	4	Hard	Published	c73c5844-5458-4613-ae07-7f00e368457f	e95303ad-ac74-4ab2-88e7-e989ae0f17a4	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	176
800e1933-2782-56a9-8745-01038b6a17a6	Đậu bắp xào thịt bò mềm mọng và bí quyết xào đậu bắp xanh giòn	dau-bap-xao-thit-bo-mem-mong-va-bi-quyet-xao-dau-bap-xanh-gi	Cùng vào bếp trổ tài làm đậu bắp xào thịt bò mềm mọng đậm đà cực dễ. Từng miếng thịt bò mềm mọng thấm vị xào cùng đậu bắp xanh giòn sần sật, hứa hẹn là món xào hao cơm nhất trong thực đơn gia đình bạn.	### Hướng dẫn cách nấu: Đậu bắp xào thịt bò mềm mọng và bí quyết xào đậu bắp xanh giòn\n\n**Bước 1: Sơ chế và ướp thịt bò**\nThịt bò bạn thái miếng vừa ăn, ướp cùng 1/2 thìa cà phê bột nêm, 1/2 thìa cà phê đường, 1 thìa cà phê dầu hào và 1 thìa canh dầu ăn để thịt mềm mọng.\n\n**Bước 2: Sơ chế đậu bắp và tỏi**\nĐậu bắp bạn rửa sạch, cắt bỏ cuống và cắt đôi. Tỏi và gừng bạn đập dập và băm nhuyễn.\n\n**Bước 3: Xào thịt bò**\nBạn phi thơm tỏi, gừng băm với dầu ăn, cho thịt bò vào xào ở lửa lớn. Đảo nhanh tay đến khi thịt vừa chuyển sang màu hồng nhạt thì tắt bếp, trút ra bát riêng để thịt không bị dai.\n\n**Bước 4: Cách xào đậu bắp với thịt bò**\nBạn phi thơm tỏi băm nhỏ, cho đậu bắp vào đảo đều ở lửa lớn. Cho thêm 1/3 bát con nước để đậu bắp chín nhanh, giữ màu xanh và độ giòn. Nêm nếm bột nêm, dầu hào cho vừa với khẩu vị gia đình. Khi đậu đã chín tới, cho thịt bò vào đảo nhanh rồi tắt bếp.\n\n**Bước 5: Thành phẩm**\nTrình bày món ăn ra đĩa, rắc thêm chút tiêu xay nếu thích. Đậu bắp xào thịt bò đạt chuẩn là khi đậu giữ được màu xanh mướt, độ giòn tự nhiên và thịt bò mềm ẩm, đậm đà hương vị.	15	10	3	Easy	Published	466433f7-31a6-49af-8ff5-4b68eb3683eb	ca9773bc-2065-432d-bde5-43001b2e1415	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	287
00e473bf-c28d-57bc-87b0-daeec99df819	Chim câu xúc bánh đa giòn thơm không tanh, đậm đà chuẩn vị tại nhà	chim-cau-xuc-banh-da-gion-thom-khong-tanh-dam-da-chuan-vi-ta	Sự kết hợp hoàn hảo giữa thịt chim ngọt bùi, đậm đà cùng các loại gia vị đặc trưng tạo nên một món xào thơm ngon khó cưỡng cho cả gia đình. Cùng Vào Bếp học cách làm chim bồ câu xúc bánh đa giòn rụm, thơm nức mũi mà không hề bị tanh nhé!	### Hướng dẫn cách nấu: Chim câu xúc bánh đa giòn thơm không tanh, đậm đà chuẩn vị tại nhà\n\n**Bước 1: Sơ chế nguyên liệu và băm thịt**\nThái mỏng hành tím, sả và rau răm. Ớt sừng bỏ hạt, thái nhỏ. Chim bồ câu sau khi làm sạch, bạn lọc bỏ xương ống cứng, phần xương nhỏ còn lại giữ nguyên rồi băm thật nhuyễn để món ăn không bị lạo xạo.\n\n**Bước 2: Xào chim câu xúc bánh đa**\nPhi thơm hành tím, sả băm với dầu ăn. Cho thịt chim đã xay vào xào săn. Khi thịt bắt đầu khô, nêm nếm nước mắm, dầu hào, hạt nêm, muối và một chút đường tuỳ khẩu vị gia đình. Lưu ý xào thật khô để khi ăn cùng bánh đa không bị ỉu. Mẹo nhỏ: Xào càng khô thì thịt chim càng thơm và giữ được độ giòn.\n\n**Bước 3: Hoàn thiện món ăn**\nKhi thịt chim đã khô và dậy mùi thơm, bạn cho ớt sừng và rau răm vào đảo đều rồi tắt bếp. Cho món ăn ra đĩa, ăn kèm bánh đa nướng giòn rụm và rau húng bạc hà để tăng thêm hương vị.\n\n**Bước 4: Thành phẩm**\nMón chim bồ câu xúc bánh đa có màu sắc bắt mắt, thịt chim giòn thơm, đậm đà, không hề bị tanh. Đây là món nhậu hoặc món ăn chơi cực kỳ cuốn hút.	20	15	2	Easy	Published	466433f7-31a6-49af-8ff5-4b68eb3683eb	7d581264-5002-4f9d-823b-11f89ddbbb9b	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	111
65176e6d-dd1e-5109-87e3-044085e7a102	Bò lúc lắc nướng sa tế bằng nồi chiên không dầu tiện lợi, hấp dẫn	bo-luc-lac-nuong-sa-te-bang-noi-chien-khong-dau-tien-loi-hap	Bò lúc lắc nướng sa tế là một món ăn được yêu thích tại Việt Nam với thịt bò thơm mềm cùng với vị cay nồng của sa tế rất thích hợp cho các bữa ăn hội họp cùng gia đình và bạn bè. Hãy cùng Điện máy XANH vào bếp thực hiện món nướng này nhé!	### Hướng dẫn cách nấu: Bò lúc lắc nướng sa tế bằng nồi chiên không dầu tiện lợi, hấp dẫn\n\n**Bước 1: Sơ chế thịt bò**\nBạn lấy dao cắt lọc đi phần thịt mỡ còn dư của thịt bò sau đó cắt thịt thành các miếng vuông vừa ăn khoảng 1.5 lóng tay cho vào tô lớn.\n\n**Bước 2: Nghiền và ướp gia vị bò**\nBạn lấy sả cắt phần đầu cho vào máy xay, xay nhuyễn rồi cho vào tô ướp thịt bò. Với hành tím, tỏi, gừng và ớt bạn cũng xay nhuyễn và lấy 3/4 cho vào tô ướp. Phần còn lại bạn múc ra chén. Tiếp đến, bạn cho vào tô ướp thịt 2 muỗng canh sa tế tôm cay, 1 muỗng canh xì dầu, 1 muỗng canh nước mắm, 2 muỗng canh rượu Thiệu Hưng, 2 muỗng canh dầu điều, 1 muỗng canh đường nâu và 1 muỗng canh tiêu bột. Cuối cùng, chúng ta trộn đều lên và đợi 30 phút cho thịt thấm đều gia vị.\n\n**Bước 3: Cắt hành củ và xiên que**\nBạn lột vỏ hành tây, cắt hành tây thành các miếng vuông vừa ăn bằng với kích thước của thịt bò đang ướp khoảng 1.2 lóng tay. Sau đó bạn đeo găng tay vào và lấy 1 que xiên, xiên thịt và hành xen kẽ nhau theo tỷ lệ 1 thịt, 1 hành. Làm tương tự với những que khác cho đến khi hết thịt.\n\n**Bước 4: Nướng bò lúc lắc**\nTa lấy kẹp thức ăn gắp từng que xiên vào nồi chiên không dầu sau đó chọn chế độ nướng trong 12 phút ở nhiệt độ 180°C.\n\n**Bước 5: Làm nước chao chấm**\nĐầu tiên, bạn lần lượt cho vào máy xay 3 muỗng canh chao, 3 muỗng canh sữa đặc, 1 muỗng canh dầu điều, 2 muỗng canh vừng trắng rang vàng, 1 muỗng canh dầu điều, 3 muỗng canh nước lọc và 3 muỗng canh hỗn hợp hành tỏi gừng ớt đã xay nhuyễn. Sau đó đậy nắp lại và xay nhuyễn cho đến khi các gia vị hòa quyện vào nhau. Cuối cùng bạn múc nước chấm chao ra chén và thưởng thức cùng với thịt bò lúc lắc nướng sa tế thơm ngon.\n\n**Bước 6: Thành phẩm**\nMón bò lúc lắc nướng sa tế sau khi nướng xong sẽ có hương thơm đặc trưng của thịt nướng. Khi ăn cùng với nước chấm chao sẽ có vị đậm đà, ngon ngọt và hấp dẫn. Rất thích hợp để ăn cùng bạn bè hoặc gia đình vào cuối tuần phải không nào?	40	12	4	Easy	Published	466433f7-31a6-49af-8ff5-4b68eb3683eb	1c7a1ddf-c7eb-4029-8fe4-49f5ea29a8b0	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	285
a7fc3ecd-5aa1-58e3-9ed1-05e4c18b1d48	Chả tôm thịt chiên vàng giòn rụm cực ngon hấp dẫn ngay tại nhà	cha-tom-thit-chien-vang-gion-rum-cuc-ngon-hap-dan-ngay-tai-n	Bạn đang tìm cách làm chả tôm thịt thơm ngon cho cả nhà? Cùng Vào bếp thực hiện món chiên hấp dẫn này với bí quyết kết hợp thịt nạc vai và tôm sú tươi, giúp miếng chả dai giòn, mọng nước, đảm bảo các bé yêu cũng sẽ thích mê.	### Hướng dẫn cách nấu: Chả tôm thịt chiên vàng giòn rụm cực ngon hấp dẫn ngay tại nhà\n\n**Bước 1: Sơ chế nguyên liệu**\nĐầu tiên, bạn chẻ đôi 2 trái ớt, loại bỏ sạch hạt bên trong rồi băm thật nhuyễn. Với 225gr tôm tươi đã làm sạch, bạn chia thành 2 phần, 1 phần thì cắt miếng nhỏ, phần còn lại dùng dao băm hoặc cho vào máy xay thịt chuyên dụng xay nhuyễn mịn.\n\n**Bước 2: Ướp gia vị đậm đà cho cách làm chả tôm thịt trứng**\nBạn chuẩn bị một chiếc tô lớn, cho 450gr thịt heo xay (thịt nạc vai), phần tôm đã xay mịn và ớt băm vào. Tiếp theo, bạn cho vào các gia vị bao gồm: 2 muỗng cà phê hạt nêm, 2 muỗng cà phê đường, 1/2 muỗng cà phê muối, 1 muỗng cà phê hạt tiêu trắng và 1/2 muỗng canh nước mắm ngon để tăng thêm hương vị đậm đà. Cuối cùng, bạn đập thêm 2 quả trứng gà, cho 1 muỗng canh tỏi băm, 1 muỗng canh hành lá và 2 muỗng canh bột năng vào hỗn hợp. Nếu thực hiện cách làm chả tôm cho bé, bạn có thể gia giảm ớt và sử dụng gia vị ăn dặm phù hợp. Bạn dùng tay đeo bao nilon hoặc muỗng trộn thật kỹ để tất cả nguyên liệu hòa quyện và thấm đều gia vị. Sau khi trộn đều, bạn nên cho hỗn hợp vào ngăn mát tủ lạnh nghỉ khoảng 15 phút.\n\n**Bước 3: Chiên chả vàng giòn hoặc hấp cách thủy**\nBạn bắt chảo lên bếp, cho 100ml dầu ăn vào đun ở lửa lớn. Khi dầu đã nóng già, bạn múc từng muỗng hỗn hợp thịt cho vào chảo, dùng muỗng ép nhẹ để miếng chả có hình tròn dẹt vừa ăn. Bạn tiến hành chiên ở lửa lớn, lật đều hai mặt cho đến khi chả chín vàng ruộm, tỏa mùi thơm nức và có lớp vỏ ngoài giòn tan thì vớt ra để ráo dầu.\n\n**Bước 4: Thành phẩm**\nNhững miếng chả tôm thịt nóng hổi, màu vàng nâu cực kỳ đẹp mắt. Khi ăn, bạn sẽ cảm nhận được lớp vỏ giòn tan, nhân bên trong ngọt thanh, mọng nước và đậm đà gia vị. Chả ngon nhất khi ăn nóng cùng cơm trắng, dưa leo và nước tương tỏi ớt.	25	15	3	Easy	Published	815bcb63-28bd-560e-8b95-d4331c543ad4	a343771d-bafb-4a55-9459-2739d0b00a20	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	160
0328808d-a3ff-572c-9a61-fc373949e163	Thịt ba chỉ rang mắm tép đậm đà cực hao cơm cho bữa cơm gia đình	thit-ba-chi-rang-mam-tep-dam-da-cuc-hao-com-cho-bua-com-gia-	Bạn muốn học cách làm thịt ba chỉ rang mắm tép chuẩn vị ẩm thực miền Bắc? Cùng Vào bếp với chuyên mục món chiên để thực hiện món ngon mỗi ngày này nhé. Đảm bảo thịt ba rọi vàng giòn, đậm đà sẽ khiến cả nhà thích mê!	### Hướng dẫn cách nấu: Thịt ba chỉ rang mắm tép đậm đà cực hao cơm cho bữa cơm gia đình\n\n**Bước 1: Sơ chế và ướp thịt ba chỉ**\nThịt ba chỉ sau khi mua về bạn đem rửa sạch với nước muối loãng, sau đó dùng giấy thấm thật khô rồi cắt thành những miếng vuông vừa ăn có kích thước khoảng 1cm. Bạn cho 900gr thịt vào tô lớn, đổ 60gr đường vào và trộn thật đều để đường ngấm vào từng thớ thịt. Việc ướp đường trước giúp mỡ thịt trong hơn và thịt có màu đẹp hơn khi chế biến.\n\n**Bước 2: Sơ chế các nguyên liệu khác**\nBạn thái lát 5 nhánh sả rồi cho vào máy xay sinh tố xay nhuyễn, để riêng. Sau đó, bạn tiếp tục cho 30gr hành tím và 30gr tỏi vào máy xay thật nhuyễn. Với phần sả đã xay, bạn lấy khoảng 2/3 cho vào bát, cho thêm một chút nước rồi cho vào túi vải vắt lấy nước cốt sả nguyên chất.\n\n**Bước 3: Cách rang thịt ba chỉ với mắm tép cháy cạnh**\nBạn bắc chảo lên bếp, cho 2 thìa canh dầu ăn và 1 thìa canh dầu màu điều vào đun nóng. Khi dầu đã nóng, bạn trút toàn bộ phần thịt ba chỉ đã ướp đường vào rang. Bạn đảo đều tay ở lửa vừa cho đến khi thịt bắt đầu săn lại và tiết ra mỡ. Lúc này, bạn đổ phần nước cốt sả đã vắt vào chảo thịt, tiếp tục rang cho đến khi nước cốt sả cạn dần và miếng thịt bắt đầu vàng giòn, cháy cạnh đẹp mắt.\n\n**Bước 4: Hoàn thành món ăn**\nKhi thịt đã vàng, bạn cho nốt phần hành, tỏi và xác sả đã xay nhuyễn vào phi thơm cùng với thịt. Tiếp đến, bạn cho 3 thìa canh mắm tép, 1 thìa canh ớt bột không cay và 1 thìa canh hạt nêm vào chảo. Bạn hạ nhỏ lửa, đảo đều tay để các gia vị quyện chặt và thấm đều vào từng miếng thịt. Khi hỗn hợp sốt mắm tép đã sánh lại, bao quanh miếng thịt vàng óng thì bạn tắt bếp và múc ra đĩa.\n\n**Bước 5: Thành phẩm**\nMiếng thịt ba chỉ vàng đều, cháy cạnh thơm lừng. Khi ăn, bạn sẽ cảm nhận được vị mặn ngọt hài hòa, cay nhẹ kích thích vị giác quyện cùng hương thơm đặc trưng của mắm tép, hành, tỏi và sả. Món này ăn kèm cơm trắng nóng hổi là tuyệt hảo nhất.	20	20	4	Easy	Published	815bcb63-28bd-560e-8b95-d4331c543ad4	852cc4dc-913d-4d95-8962-4c5407d77d3c	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	125
af6c8fb3-5c98-555c-88cd-531a8c513312	Heo rừng xào sa tế sả ớt giòn ngon làm mồi nhấm cực đơn giản	heo-rung-xao-sa-te-sa-ot-gion-ngon-lam-moi-nham-cuc-don-gian	Heo rừng xào sa tế là món xào độc đáo với hương vị đậm đà và thịt heo rừng giòn ngon. Hôm nay, hãy cùng Điện máy XANH vào bếp để thực hiện ngay cách làm món heo rừng xào sa tế thơm phức, cay nồng cho bữa cơm gia đình thêm hấp dẫn nhé.	### Hướng dẫn cách nấu: Heo rừng xào sa tế sả ớt giòn ngon làm mồi nhấm cực đơn giản\n\n**Bước 1: Sơ chế nguyên liệu**\nThịt heo rừng mua về bạn dùng dao cạo sạch lông, rửa với nước muối loãng để khử mùi hôi thịt rừng hiệu quả. Bạn có thể thui sơ qua phần da để khử mùi. Sau đó, bạn rửa lại thịt heo bằng nước sạch, để ráo và cắt thành những miếng mỏng vừa ăn khoảng 0.5cm. Sả bào mỏng, băm nhuyễn cùng với tỏi, và hành tím.\n\n**Bước 2: Ướp thịt heo rừng**\nCho thịt vào tô lớn, thêm vào 1 phần sả băm, tỏi băm và hành tím băm. Tiếp tục cho 3 muỗng canh dầu hào, 2 muỗng cà phê bột nêm, 1/2 muỗng canh đường (tùy chọn) và 2 muỗng canh ớt sa tế vào trộn đều. Bạn để thịt ngấm gia vị trong khoảng 15 - 20 phút.\n\n**Bước 3: Xào thịt heo rừng**\nBạn đặt chảo lên bếp và bật lửa, cho 1 muỗng canh dầu ăn và một ít dầu màu điều vào đun nóng. Khi dầu đã nóng, bạn cho phần sả băm và tỏi băm vào phi. Bạn dùng đũa đảo đều tay cho đến khi ngửi thấy mùi sả và tỏi tỏa hương thơm lừng. Khi các nguyên liệu vàng thơm, bạn đổ toàn bộ thịt heo rừng đã ướp vào xào ở lửa lớn. Đảo nhanh tay cho đến khi thịt săn lại và dậy mùi thơm. Cuối cùng, khi thịt đã chín, bạn nêm thêm 1 muỗng cà phê nước mắm vào, đảo nhanh tay cho thịt đậm đà rồi tắt bếp.\n\n**Bước 4: Thành phẩm**\nMón thịt heo rừng xào sa tế hoàn thành có màu sắc bắt mắt, thơm nồng mùi sả và tỏi. Khi ăn, bạn sẽ cảm nhận được độ giòn của da heo, thịt mềm thấm vị cay cay của sa tế. Món này dùng kèm cơm nóng hoặc xúc bánh đa, thêm chút rau răm thì ngon tuyệt hảo.	20	25	3	Easy	Published	466433f7-31a6-49af-8ff5-4b68eb3683eb	7c46cda2-3fd0-431a-894f-c0b15881fbfb	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	158
0d671484-83b8-53a4-9d47-f04c612bea06	Cánh gà nướng muối ớt ngon đậm đà hấp dẫn dễ làm	canh-ga-nuong-muoi-ot-ngon-dam-da-hap-dan-de-lam	Cánh gà nướng muối ớt với lớp da vàng ươm, giòn giòn thơm nức mũi là món ăn mà chắc chắn ai cũng mê. Các bạn cùng vào bếp với Điện máy XANH thực hiện ngay món nướng vô cùng hấp dẫn này nhé!	### Hướng dẫn cách nấu: Cánh gà nướng muối ớt ngon đậm đà hấp dẫn dễ làm\n\n**Bước 1: Sơ chế cánh gà**\nCánh gà bạn rửa qua với nước. Tiếp đến bạn dùng muối chà xát cánh gà để làm sạch cặn bẩn, váng mỡ. Sau đó rửa lại với nước sạch, để ráo. Tiếp đó dùng mũi nhọn của dao đâm nhẹ quanh bề mặt cánh gà để khi ướp gia vị được thấm hơn.\n\n**Bước 2: Sơ chế các nguyên liệu khác**\nHành tím, tỏi bóc vỏ để nguyên củ. Gừng rửa sạch, cạo vỏ, cắt lát. Ớt rửa sạch để ráo. Rau húng lủi, lặt lá, rửa sạch, để ráo. Dưa leo rửa sạch, cắt lát. Để làm muối ớt xanh làm gia vị chấm cánh gà nướng, bạn cho vào cối 2 trái ớt đỏ, 5 trái ớt xanh, 2 muỗng cà phê muối, 1 muỗng cà phê bột ngọt, 1 ít rau húng lủi rồi dùng chày giã nhuyễn hỗn hợp.\n\n**Bước 3: Xay hỗn hợp ướp**\nCho vào cối xay 3 trái ớt, gừng cắt lát, 3 củ hành tím, 4 tép tỏi, 1 muỗng cà phê muối, 2 muỗng canh dầu ăn, 1 muỗng canh nước mắm, 2 muỗng cà phê bột ớt. Thêm 2 muỗng canh sữa tươi không đường, 1 muỗng canh tương ớt, 2 muỗng canh mật ong, 1 muỗng cà phê bột nghệ. Sau đó, xay nhuyễn hỗn hợp, tiếp đến bạn rây qua hỗn hợp lọc bỏ phần xác, lấy phần nước dùng để ướp cánh gà.\n\n**Bước 4: Ướp cánh gà**\nCho cánh gà cho vào tô lớn, trộn đều với 2 muỗng canh hỗn hợp ướp rồi để cánh gà ướp khoảng 1 giờ cho cánh gà ngấm gia vị. Sau đó, bạn dùng xiên tre, xiên cánh gà để khi nướng việc trở cánh gà được dễ hơn.\n\n**Bước 5: Nướng gà**\nĐể lò ổn định nhiệt độ, bạn làm nóng lò nướng trước 10 phút ở 180 độ C . Xếp cánh gà lên khay, cho vào lò nướng trong vòng 20 phút ở nhiệt độ 180 độ C. Sau 20 phút bạn mở lò, lấy cánh gà ra, dùng cọ phết đều 1 lớp hỗn hợp ướp lên cánh gà rồi tiếp tục nướng cánh gà ở 220 độ C thêm 10 phút nữa là hoàn tất.\n\n**Bước 6: Thành phẩm**\nCánh gà nướng vàng ươm, thơm phức có lớp da giòn giòn, thịt gà mềm thấm vị cay cay mặn mặn vừa ăn. Bạn ăn kèm cánh gà nướng với dưa leo, rau húng lủi chấm thêm ít muối ớt xanh ngon hết ý.	20	30	4	Easy	Published	48914c7a-b280-45d4-b0b3-7ac5488f9394	078bf482-fe40-4efb-9281-4ae88d007f46	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	96
fe9e5b13-de22-5cc0-b1e0-be1faf53d158	2 cách làm nọng heo nướng tại nhà bằng nồi chiên không dầu	2-cach-lam-nong-heo-nuong-tai-nha-bang-noi-chien-khong-dau	Thịt nạc nọng heo là bộ phận ngon nhất của con heo. Loại thịt này có nhiều cách chế biến, nhưng tuyệt vời nhất là dùng để làm món nướng. Vào bếp làm ngay món nọng heo nướng thơm ngon chiêu đãi gia đình nhé!	### Hướng dẫn cách nấu: 2 cách làm nọng heo nướng tại nhà bằng nồi chiên không dầu\n\n**Bước 1: Pha hỗn hợp ướp nọng heo nướng**\nĐầu tiên, bạn cho hành khô và tỏi vào máy xay nhuyễn. Tiếp theo, thêm vào hỗn hợp 1.5 thìa hạt nêm, 1 thìa bột ngọt, 2 thìa nước mắm, 1.5 muỗng dầu hào, 1 thìa sa tế, một chút tiêu, 2 thìa sữa đặc để tạo độ ngọt và giúp thịt không bị cháy. Cuối cùng, thêm ngũ vị hương, một chút nước và dầu ăn rồi xay đều tất cả thành hỗn hợp sệt.\n\n**Bước 2: Ướp thịt nọng heo nướng**\nCho toàn bộ hỗn hợp gia vị vừa xay vào ướp cùng miếng nọng heo. Bạn nên để nguyên miếng lớn khi nướng để thịt giữ được độ mọng nước, không bị khô. Dùng màng bọc thực phẩm bao kín tô thịt, cho vào ngăn mát tủ lạnh và ướp trong khoảng 1.5 đến 2 tiếng cho gia vị thấm đều vào từng thớ thịt.\n\n**Bước 3: Áp chảo và nướng thịt**\nBắc chảo lên bếp, đợi chảo nóng già thì cho một chút dầu ăn vào. Cho miếng thịt nọng đã ướp vào áp chảo cho đến khi các cạnh xém vàng và dậy mùi thơm đặc trưng của ngũ vị hương. Sau đó, bạn chuyển thịt vào nồi chiên không dầu ở nhiệt độ 180 độ C trong khoảng 7 phút.\n\n**Bước 4: Thành phẩm**\nThái thịt nọng heo nướng thành những miếng mỏng vừa ăn, bạn có thể dùng kèm dưa góp để tăng thêm hương vị. Miếng thịt có màu vàng óng đẹp mắt, khi ăn cảm nhận rõ độ giòn sần sật, vị ngọt từ sữa đặc và hương thơm nồng nàn của ngũ vị hương mà không hề gây cảm giác ngấy.\n\n**Bước 5: Ướp nọng heo**\nNọng heo sau khi rửa sạch thì mang đi ướp với chao và các gia vị đã chuẩn bị sẵn. Ướp nọng heo từ 3 - 4 tiếng để gia vị thấm hoàn toàn.\n\n**Bước 6: Nướng nọng heo**\nMang nọng heo đi nướng trong nồi chiên không dầu. Lần 1, bạn nướng nọng heo với nhiệt độ 170 trong 15 phút. Lần 2, bạn trở mặt thịt và nướng với nhiệt độ 180 trong 5 phút nữa.\n\n**Bước 7: Thành quả và thưởng thức**\nNạc nọng heo sau khi nướng xong thì mang ra cắt thành những lát mỏng vừa ăn. Món này ngon nhất là khi được cuốn trong rau xà lách và chấm chao.	30	60	2	Hard	Published	48914c7a-b280-45d4-b0b3-7ac5488f9394	573f12df-dbdb-40b0-82f9-bd52ca5c972c	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	135
fca4c223-74d8-5132-af27-fbb11c02ebe9	Trứng cút nướng muối Trung Hoa thơm thảo mộc mà không bị mặn	trung-cut-nuong-muoi-trung-hoa-thom-thao-moc-ma-khong-bi-man	Nếu là tín đồ của các món nướng vỉa hè, bạn phải thử ngay phiên bản trứng cút nướng muối kiểu Trung Hoa đầy hấp dẫn này. Những quả trứng vàng ươm, thấm đẫm lớp muối thơm lừng vị thảo mộc, ăn một lần là mê. Hãy cùng Vào Bếp để thực hiện ngay món ăn vặt độc đáo này nhé!	### Hướng dẫn cách nấu: Trứng cút nướng muối Trung Hoa thơm thảo mộc mà không bị mặn\n\n**Bước 1: Sơ chế thảo mộc**\nRang thơm các nguyên liệu gồm quế, hạt ngò, tiểu hồi, đinh hương, hoa hồi, thảo quả và vỏ quýt khô. Sau đó đem xay sơ rồi trộn cùng 1/4 muỗng cà phê bột ngũ vị hương.\n\n**Bước 2: Ngâm trứng cút với thảo mộc**\nPha hỗn hợp thảo mộc với 1,5 lít nước và 1,5 muỗng cà phê muối. Cho trứng cút đã rửa sạch vào ngâm trong 1,5 tiếng để thấm vị.\n\n**Bước 3: Luộc và ủ trứng cút**\nVớt trứng cút vào nồi, thêm nước thảo mộc vừa đủ ngập trứng. Luộc 10 phút, tắt bếp ủ 1 tiếng. Tiếp tục luộc lần hai 10 phút rồi ủ thêm 2 tiếng để trứng thơm đậm đà. Mẹo nhỏ: Nếu bạn muốn thành phẩm trứng cút có màu vàng đậm đà, hãy ngâm trứng thêm 1-2 tiếng. Tránh ngâm quá lâu sẽ làm trứng mặn và nồng mùi thảo mộc.\n\n**Bước 4: Chuẩn bị muối ủ**\nTrộn 2kg muối với một ít nước và 2 lòng trắng trứng gà cho đến khi hỗn hợp có độ kết dính tốt, nắm lại không bị rời rạc.\n\n**Bước 5: Tạo hình và nướng trứng**\nLót vải lên vỉ hấp, rải một lớp muối, xếp trứng vào rồi rắc đều 1 muỗng cà phê ngũ vị hương trên trứng, cuối cùng đắp thêm muối lên trên. Đun sôi nồi nước bên dưới để hơi nóng làm cứng lớp muối bao quanh trứng.\n\n**Bước 6: Thành phẩm**\nTrứng cút nướng muối Trung Hoa có lớp vỏ muối cứng cáp, bên trong trứng thấm vị thảo mộc thơm lừng, béo ngậy mà không hề bị mặn.	20	240	12	Hard	Published	48914c7a-b280-45d4-b0b3-7ac5488f9394	456e6fad-7dc8-4695-8063-23bf6e2c73f3	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	98
5cd6107b-08cb-5205-b4a5-e5b055f39e2f	Vịt quay tiêu tại nhà: bí quyết chuẩn vị Ma Cao	vit-quay-tieu-tai-nha-bi-quyet-chuan-vi-ma-cao	Bạn đang tìm kiếm công thức vịt quay tiêu da giòn rụm, thơm lừng chuẩn vị Ma Cao? Hãy cùng Vào Bếp thực hiện ngay món nướng này, đảm bảo thành công ngay lần đầu tiên!	### Hướng dẫn cách nấu: Vịt quay tiêu tại nhà: bí quyết chuẩn vị Ma Cao\n\n**Bước 1: Sơ chế vịt sạch sẽ**\nĐầu tiên, vịt sau khi rã đông hoàn toàn (nếu là vịt đông đá), bạn hãy rửa sạch ngay dưới vòi nước mát và để vịt thật ráo nước. Lưu ý, da vịt bị trầy xước sẽ không giòn nên đừng chà xát mạnh hay dùng gừng, giấm, rượu để chà lên da vịt nhé.\n\n**Bước 2: Pha muối ướp vịt đậm đà**\nTrong một tô lớn, bạn cho 6 gr muối, 20 gr đường, 10 gr bột ngọt, 2 gr bột sa cương (nếu không có có thể thay bằng ngũ vị hương) + 1 gr ngũ vị hương, 2 gr bột tiêu xanh. Bạn cho 6 gr tiêu đen nguyên hạt vào cối giã dập hoặc xay sơ, đừng xay quá nhuyễn để giữ được mùi thơm nồng. Bóp nhỏ 3 lá nguyệt quế rồi cho tất cả vào tô gia vị, trộn đều.\n\n**Bước 3: Ướp vịt và ghim kín phần cổ**\nKhi vịt ráo, bạn cho toàn bộ hỗn hợp muối ướp vào trong bụng vịt và đều khắp các phần thịt bên trong: hai bên đùi, ức, lưng... để gia vị thấm sâu. Sau đó, xếp gọn phần da cổ vịt và dùng que tre xiên thịt ghim kín lại. Việc này giúp vịt phồng lên tự nhiên khi nướng mà không cần bơm hơi. Để vịt nghỉ từ 30 đến 60 phút cho thấm gia vị.\n\n**Bước 4: Pha tương vịt chuẩn vị Ma Cao**\nĐể pha tương vịt chuẩn vị Ma Cao, bạn cho 8 gr chao đỏ, 20 gr tương hoisin, 10 gr dầu hào, 20 gr tương trụ hầu (có thể thay bằng sốt xá xíu nhưng giảm đường vì tương xá xíu ngọt hơn). Đánh đều cho chao tan hết. Giã hoặc nghiền hơi nhuyễn 1 gr mè rang vàng cho vào hỗn hợp tương. Cuối cùng, thêm 1 muỗng cà phê rượu trắng (rượu sakê hoặc rượu nấu ăn đều được) và khuấy đều.\n\n**Bước 5: Nhồi tương và may kín bụng vịt**\nKhi vịt ướp đủ thời gian, bạn dùng cây vét bột hoặc muỗng để trải đều tương vịt đã pha khắp bên trong bụng vịt. Nếu thích, bạn có thể nhồi thêm nấm mèo và hoa kim châm đã ngâm mềm vào bụng vịt cùng tương. Sau đó, dùng kim và chỉ nấu ăn để may kín phần bụng vịt và phần da vịt bị rách nếu có. Cắt bỏ phần đầu cánh vịt, chỉ chừa lại đoạn trên của cánh.\n\n**Bước 6: Chần nước sôi và phết giấm cho vịt quay da giòn**\nBạn nấu sẵn 1 lít nước sôi. Cầm vịt lên (có thể dùng móc nếu có) từ từ dội nước sôi khắp da vịt từ cổ xuống ức và lưng để da vịt săn lại. Tiếp theo, pha hỗn hợp giấm để phết lên da vịt gồm 40 gr mạch nha, 60 gr giấm trắng, 5 gr giấm đỏ và 2 gr muối nở. Thoa đều hỗn hợp giấm lên khắp da vịt. Hỗn hợp giấm này là bí quyết giúp da vịt lên màu tự nhiên và giòn tan khi nướng.\n\n**Bước 7: Sấy khô vịt - Bí quyết vịt quay tiêu da giòn rụm**\nVà bí quyết cực kỳ quan trọng để món vịt quay tiêu có da giòn rụm. Bạn nên dùng quạt thổi trực tiếp vào vịt liên tục trong khoảng 1 ngày (24 tiếng) cho da vịt khô hoàn toàn. Da vịt càng khô thì khi nướng càng giòn và lên màu càng đẹp.\n\n**Bước 8: Nướng vịt quay tiêu thơm lừng**\nLàm nóng lò nướng ở nhiệt độ 120°C (248°F) với chế độ quạt trong 10 phút. Đặt vịt ở rãnh giữa lò, cách thanh nhiệt khoảng một gang tay. Sau 10 phút, tăng nhiệt độ lên 180°C (356°F) vẫn giữ chế độ quạt, với vịt 1.8kg, bạn có thể nướng khoảng 35-40 phút, vịt 2.4-2.5kg thì nướng 50 phút. Nếu lò không có quạt, bạn bật 200°C và trở vịt để vàng đều. Mẹo nhỏ: Nếu bạn muốn lấy nước sốt trong bụng vịt để chấm, hãy để vịt nghỉ khoảng 10 phút sau khi nướng rồi rút kim may ra. Nếu để lâu hơn, nước sốt sẽ thấm ngược vào thịt.\n\n**Bước 9: Thành phẩm**\nVịt quay tiêu sau khi nướng sẽ có lớp da vàng óng, giòn rụm và thịt chín mềm, ngọt đậm đà. Bạn có thể cắt vịt thành từng miếng vừa ăn và thưởng thức cùng cơm, bánh mì hoặc kẹp vào bánh bao đều rất ngon. Món vịt nướng tiêu này có vị ngọt đậm đà và cay nhẹ đặc trưng, đảm bảo sẽ làm hài lòng cả những thực khách khó tính nhất!	90	60	4	Hard	Published	48914c7a-b280-45d4-b0b3-7ac5488f9394	98ec81e8-21ab-41be-a3f2-cdf05dfcc8b5	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	60
5d86a6bc-b484-57ad-ade8-562a33b59cfc	Cá thu sốt cam thơm ngon đậm đà cho bữa cơm gia đình thêm hấp dẫn	ca-thu-sot-cam-thom-ngon-dam-da-cho-bua-com-gia-dinh-them-ha	Cá thu sốt cam là món ăn độc đáo giúp đổi vị cho thực đơn gia đình. Cùng Vào bếp thực hiện món chiên này để cảm nhận vị ngọt tự nhiên của cá hòa quyện cùng nước sốt cam. Cách làm cá thu sốt cam cực kỳ đơn giản, hứa hẹn mang lại bữa cơm ngon miệng và giàu dinh dưỡng.	### Hướng dẫn cách nấu: Cá thu sốt cam thơm ngon đậm đà cho bữa cơm gia đình thêm hấp dẫn\n\n**Bước 1: Chiên cá vàng giòn**\nBạn rửa sạch lát cá thu, dùng khăn giấy thấm khô các mặt cá để khi chiên ít bị văng dầu. Bắc chảo lên bếp, cho lượng dầu ăn vừa đủ ngậm đáy chảo. Khi dầu nóng, cho lát cá thu vào chiên lửa vừa. Bạn lưu ý lật trở mặt cá cẩn thận để cá được chín vàng đều cả hai mặt, sau đó vớt cá ra đĩa cho ráo dầu.\n\n**Bước 2: Làm nước sốt cam**\nBạn vắt lấy nước cốt từ 2 trái cam vào một bát nhỏ. Tiếp theo, bạn cho vào bát nước cam các gia vị gồm: 1 muỗng hạt nêm, 1 muỗng bột ngọt, 1 muỗng đường, 2 muỗng canh nước mắm và một ít tiêu. Bạn dùng muỗng khuấy thật đều tay để toàn bộ gia vị hòa quyện vào nhau.\n\n**Bước 3: Cách làm cá thu sốt cam đậm đà**\nBạn tận dụng chảo vừa chiên cá (hoặc dùng chảo mới), phi thơm hỗn hợp hành và tỏi đã băm nhỏ. Khi hành tỏi đã dậy mùi thơm, bạn đổ bát nước sốt cam vào, đun đến khi nước sốt sôi và bắt đầu nóng lên thì bạn cho lát cá thu đã chiên vào. Bạn dùng muỗng múc nước sốt rưới liên tục lên mặt cá để cá thấm đều gia vị, đun thêm một lúc cho nước sốt hơi sánh lại thì tắt bếp.\n\n**Bước 4: Thành phẩm**\nCho cá ra đĩa, rưới nước sốt cam lên trên và rắc hành lá. Món cá thu sốt chua ngọt này có lớp da dai nhẹ, thịt ngọt lịm, là món chính cực kỳ đưa cơm.	10	15	1	Easy	Published	815bcb63-28bd-560e-8b95-d4331c543ad4	cc06a093-474f-4659-9db0-ed4c708e2978	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	183
28b8f38a-632d-572c-b260-34207bfdd35f	Xôi cua ngon và mẹo chiên vỏ xôi giòn rụm chuẩn vị như ngoài hàng	xoi-cua-ngon-va-meo-chien-vo-xoi-gion-rum-chuan-vi-nhu-ngoai	Bạn đang tìm kiếm một món chiên độc đáo, kết hợp hoàn hảo giữa độ giòn tan của lớp vỏ và vị ngọt thanh của hải sản? Hôm nay, Vào Bếp sẽ chia sẻ bí quyết làm xôi cua chiên giòn rụm, đậm đà, chuẩn vị ngay tại nhà. Cùng khám phá ngay thôi!	### Hướng dẫn cách nấu: Xôi cua ngon và mẹo chiên vỏ xôi giòn rụm chuẩn vị như ngoài hàng\n\n**Bước 1: Sơ chế thịt cua**\nCua mua về rửa sạch, hấp chín rồi tỉ mỉ lột lấy phần thịt cua bể. Các bác nhớ giữ lại phần mai và càng cua để trang trí cho sinh động.\n\n**Bước 2: Xào cua, nấm hương và lạp xưởng cùng xôi**\nSử dụng dầu hành vừa phi để phi thơm đầu hành, sau đó cho nấm hương và lạp xưởng vào đảo đều. Tiếp đến cho thịt cua vào, nêm 1 muỗng canh dầu hào và 1/4 muỗng cà phê tiêu cho dậy mùi thơm. Cuối cùng là trộn đều phần nhân này cùng hành lá và xôi trắng nóng hổi.\n\n**Bước 3: Chiên vỏ xôi giòn rụm**\nĐây là bước quan trọng để tạo nên sự đặc biệt của món xôi cua này. Bạn dàn mỏng xôi vào tô hoặc thau inox rồi đem chiên ngập dầu. Trong quá trình chiên cần xoay đều tay để vòng xôi vàng đều, tròn trịa. Khi xôi đã vàng giòn thì vớt ra để nguội bớt, vỏ xôi sẽ tự tróc ra khỏi bát dễ dàng.\n\n**Bước 4: Thành phẩm**\nXếp phần nhân xôi cua, thêm thịt cua và hành lá bào sợi vào bên trong vỏ xôi chiên giòn, đặt mai cua lên trên cùng chân cua trang trí. Món xôi cua hoàn thành với vỏ ngoài giòn tan, bên trong xôi dẻo quyện cùng nhân cua ngọt thơm, lạp xưởng và hành phi béo ngậy.	45	90	2	Hard	Published	815bcb63-28bd-560e-8b95-d4331c543ad4	e95303ad-ac74-4ab2-88e7-e989ae0f17a4	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	119
f7c4667e-40e8-5e83-97c3-1beb5319a200	Gà hấp bầu ngọt ngon chuẩn vị, thơm nức mũi cực kỳ đơn giản	ga-hap-bau-ngot-ngon-chuan-vi-thom-nuc-mui-cuc-ky-don-gian	Bạn đang tìm cách làm gà hấp bầu thơm ngon để đổi vị cho gia đình? Cùng Vào bếp thực hiện món hấp thanh mát này nhé. Với thịt gà dai ngọt và quả bầu sao, món ăn chắc chắn là lựa chọn tuyệt vời cho thực đơn món ngon mỗi ngày.	### Hướng dẫn cách nấu: Gà hấp bầu ngọt ngon chuẩn vị, thơm nức mũi cực kỳ đơn giản\n\n**Bước 1: Sơ chế và ướp gà**\nGà ta sau khi mua về bạn làm sạch, để ráo nước. Bạn cho gà vào khay lớn. Với con gà khoảng 1.8kg thì bạn tiến hành ướp với 1 muỗng canh hạt nêm, 1/2 muỗng canh đường, 3 muỗng canh nước mắm, 3 muỗng canh dầu hào, 1/2 muỗng canh tiêu xay, hành tím và tỏi băm nhỏ cùng 1 muỗng cà phê bột nghệ để tạo màu. Bạn đeo bao tay, thoa đều hỗn hợp gia vị lên khắp mình gà và bên trong bụng gà, để gà thấm trong khoảng 30 phút trước khi hấp.\n\n**Bước 2: Sơ chế rau củ**\nQuả bầu bạn gọt vỏ, rửa sạch và cắt thành những miếng tròn vừa ăn. Ngô ngọt bạn lột vỏ, bỏ xơ và cắt khúc tròn. Hành lá rửa sạch, cắt khúc dài. Nấm đùi gà mini rửa sạch, để ráo. Hành tây bạn bóc vỏ, cắt thành những khoanh tròn dày để lót đáy nồi.\n\n**Bước 3: Hấp gà**\nBạn xếp các khoanh hành tây xuống dưới đáy nồi để chống dính và tạo mùi thơm, sau đó đặt gà đã ướp vào. Bạn đổ thêm 1 chén nước dừa vào nồi để tạo vị ngọt thanh. Đậy nắp và hấp gà ở lửa thật nhỏ trong khoảng 30 phút cho thịt gà chín mềm từ bên trong.\n\n**Bước 4: Hấp kèm rau củ**\nKhi gà đã hấp được 30 phút, bạn mở nắp nồi và lần lượt xếp ngô ngọt, nấm đùi gà và bầu vào xung quanh con gà. Tiếp tục đậy nắp và hấp thêm 10 phút nữa. Cuối cùng, bạn cho hành lá cắt khúc lên trên, đậy nắp hấp thêm khoảng 2 phút cho hành vừa chín tới là có thể tắt bếp.\n\n**Bước 5: Làm nước chấm và hoàn thành**\nBạn pha nước chấm theo công thức: 2 muỗng đường, 2 muỗng muối tiêu cay, 2 muỗng nước cốt chanh và vài quả ớt xiêm xanh đập dập, khuấy đều cho hỗn hợp sánh mịn. Bày gà ra đĩa cùng rau củ, tưới thêm nước hấp gà lên trên là hoàn tất.\n\n**Bước 6: Thành phẩm**\nMón gà hấp bầu sau khi hoàn thành có màu vàng óng bắt mắt của bột nghệ. Thịt gà dai ngọt, thơm lừng mùi nước dừa và hành tây. Bầu, ngô và nấm chín tới giữ được độ giòn ngọt tự nhiên, chấm cùng nước muối tiêu chanh ớt xiêm xanh cay nồng sẽ tạo nên một hương vị vô cùng bùng nổ.	40	52	4	Hard	Published	91b2e421-ca53-5b47-90df-1569446ba13d	ca9773bc-2065-432d-bde5-43001b2e1415	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	250
bfd455b1-f053-5cff-8c63-b67f40072494	Mực hấp gừng giòn ngọt thơm nức và cực đẹp mắt để chiêu đãi cả nhà	muc-hap-gung-gion-ngot-thom-nuc-va-cuc-dep-mat-de-chieu-dai-	Chào bạn! Hôm nay, Vào bếp sẽ hướng dẫn bạn làm món mực hấp gừng giòn ngọt, thơm lừng. Món hấp này không chỉ dễ làm mà còn có bí quyết pha nước chấm mắm gừng cực đỉnh. Đảm bảo cả nhà sẽ mê mẩn hương vị hấp dẫn này!	### Hướng dẫn cách nấu: Mực hấp gừng giòn ngọt thơm nức và cực đẹp mắt để chiêu đãi cả nhà\n\n**Bước 1: Sơ chế mực tươi**\nĐể làm món mực hấp gừng sả được ngon, trước tiên chúng ta cần sơ chế mực thật khéo léo. Bạn hãy rút túi mực ra mà không làm rơi đầu mực để khi hấp trông đẹp mắt. Giữ lại phần xương sống để mực không bị co lại. Vỏ lụa bên ngoài cũng không cần lột để mực có màu tím hồng đẹp mắt. Nếu không thích, bạn có thể nặn phần răng mực ở chính giữa các xúc tu. Sau đó, rửa nhẹ mực qua nước muối loãng, xả lại nước sạch và để ráo.\n\n**Bước 2: Sơ chế gừng và các loại rau củ khác**\nGừng giữ lại vỏ, rửa sạch, một phần đập dập và một phần xắt sợi để hấp và trang trí. Với sả, bóc bỏ lớp vỏ héo bên ngoài, rửa sạch, đập dập và cắt khúc. Ớt sừng dùng một nửa thái sợi, nửa còn lại xắt lát chéo. Cần tây ngâm rửa sạch với nước muối rồi cắt khúc dài khoảng 6-7 cm. Hành tây sau khi lột vỏ thì bổ múi cau nhỏ. Khi hấp mực, việc thêm hành tây và cần tây sẽ giúp món ăn tăng thêm hương vị thơm thanh, giòn ngọt hấp dẫn. Đầu hành lá rửa sạch và giữ nguyên. Các loại rau thơm ăn kèm như lá lốt, rau răm, bạc hà, dưa chuột thì nhặt và ngâm rửa nước muối sạch sẽ, để ráo nước. Dưa chuột xắt lát vừa ăn nhé.\n\n**Bước 3: Hấp mực với gừng thơm lừng**\nCho nước vào nồi, lượng nước áng chừng khoảng 1/2 khoảng cách từ đáy nồi đến vị trí xửng hấp. Tiếp theo, thả sả và gừng đập dập vào nồi rồi nấu sôi nước lên. Khi nước đã sôi, bạn xếp mực vào vỉ hấp và đậy nắp nồi. Hấp mực ở lửa lớn vừa trong khoảng 5 đến 6 phút là mực sẽ chín tới và giòn ngọt.\n\n**Bước 4: Pha nước chấm mắm gừng chuẩn vị**\nĐầu tiên, băm nhỏ tỏi, sả và gừng. Pha nước chấm với 5 thìa canh nước mắm, gần 2 thìa canh đường và 3 thìa canh nước cốt chanh. Khuấy đều cho đường tan hoàn toàn. Sau khi đường đã tan, cho sả, gừng, tỏi, ớt băm vào và khuấy đều. Nếu thích, bạn có thể rắc thêm một ít tiêu xay lên trên để tăng hương vị.\n\n**Bước 5: Thành phẩm**\nLúc này, mực hấp cũng đã chín tới rồi. Bạn hãy cho mực ra đĩa, bày biện thêm nước chấm mắm gừng và rau thơm, dưa chuột ăn kèm. Mực tươi được hấp chín trong thời gian phù hợp nên rất giòn và ngọt. Các loại rau củ hấp kèm như sả, gừng, hành tây, cần tây không chỉ tăng thêm hương vị mà còn làm món ăn đẹp mắt hơn. Đặc biệt, nước chấm mắm gừng vừa vị sẽ càng giúp món mực hấp thơm ngon hơn rất nhiều. Món mực hấp này nên ăn lúc nóng, bạn có thể để nguyên con hoặc cắt nhỏ miếng tùy ý nhé.	25	10	3	Easy	Published	91b2e421-ca53-5b47-90df-1569446ba13d	7d581264-5002-4f9d-823b-11f89ddbbb9b	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	245
874dd168-04dc-5ff5-8b0c-46fe08b54760	Gà ủ muối thảo mộc hoa tiêu chuẩn kinh doanh thơm ngon đậm vị	ga-u-muoi-thao-moc-hoa-tieu-chuan-kinh-doanh-thom-ngon-dam-v	Bạn muốn học cách làm gà ủ muối thảo mộc thơm ngon chuẩn vị kinh doanh? Cùng Vào bếp thực hiện món từ gà này với lớp da giòn sần sật và màu vàng tự nhiên. Đảm bảo cả gia đình sẽ trầm trồ với tay nghề của bạn ngay lần đầu thử sức.	### Hướng dẫn cách nấu: Gà ủ muối thảo mộc hoa tiêu chuẩn kinh doanh thơm ngon đậm vị\n\n**Bước 1: Sơ chế và tạo hình gà**\nGà sau khi mổ sạch, bạn dùng quả tắc hoặc chanh cùng muối trắng chà xát kỹ toàn bộ thân gà. Việc massage này giúp khử sạch mùi hôi tanh, giúp da gà sạch và thơm ngon hơn sau khi chế biến. Tiếp theo, bạn tạo hình gà bằng cách bẻ chân cho vào trong bụng, đầu và cổ gà thì kẹp gọn vào cánh. Cách làm này giúp gà có hình dáng gọn gàng, đẹp mắt và không bị chiếm quá nhiều diện tích khi cho vào nồi.\n\n**Bước 2: Nấu nước gia vị làm gà ủ muối thảo mộc**\nBạn cho 16 lít nước vào nồi lớn, sau đó cho tất cả thảo mộc gồm hoa hồi, thảo quả đập dập, hoa tiêu, quế chi, đinh hương, mắc khén vào. Đừng quên thêm ớt khô và lá chanh để tạo mùi thơm đặc trưng. Đun sôi hỗn hợp này trong khoảng 15 - 20 phút. Đây là công đoạn quan trọng để các loại thảo mộc tiết hết tinh dầu và mùi thơm nồng nàn ra nước dùng.\n\n**Bước 3: Ủ gà**\nSau khi đun thảo mộc, bạn cho 400gr đường vàng, 200gr mì chính, 200gr muối tinh, 220gr hạt nêm Knorr, 160gr bột thịt gà Knorr, 20gr cốt gà, 30gr tinh bột nghệ và 100gr muối đỏ vào nồi rồi khuấy tan. Cho gà vào nồi, dùng một chiếc thớt nặng chèn lên trên để đảm bảo gà ngập hoàn toàn trong nước. Tiến hành ủ gà từ 4 - 6 tiếng, lưu ý cứ mỗi 2 tiếng nên đảo gà một lần để màu sắc và gia vị thấm đều.\n\n**Bước 4: Luộc gà ủ muối hoa tiêu thảo mộc**\nBật bếp đun sôi nồi gà trở lại, sau đó hạ lửa nhỏ để nước sôi lăn tăn trong 15 phút nhằm giữ cho da gà không bị nứt. Tắt bếp và tiếp tục để gà trong nồi ủ thêm 15 - 30 phút tùy vào kích thước gà. Cuối cùng, vớt gà ra. Đợi gà nguội hẳn, bạn có thể đem đi hút chân không để bảo quản thực phẩm được lâu hơn.\n\n**Bước 5: Thành phẩm**\nGà ủ muối thảo mộc sau khi hoàn thành sẽ có lớp da giòn sần sật, thịt gà dai ngọt thấm đẫm hương vị đặc sản vùng miền. Màu vàng từ nghệ tươi giúp món ăn trông vô cùng hấp dẫn, cực kỳ phù hợp cho các bữa tiệc gia đình. Gà thành phẩm sau khi hút chân không có thể bảo quản trong ngăn mát tủ lạnh trong vòng 2 tuần. Nếu muốn để lâu hơn, bạn có thể bảo quản trong ngăn đá được vài tháng. Khi ăn chỉ cần rã đông tự nhiên hoặc làm nóng lại bằng lò vi sóng, nồi chiên không dầu.	480	45	10	Hard	Published	91b2e421-ca53-5b47-90df-1569446ba13d	1c7a1ddf-c7eb-4029-8fe4-49f5ea29a8b0	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	128
2ac1d7c8-6896-5fb6-bd0b-1b14c7e480f6	Xôi Hoàng Phố dẻo thơm màu vàng đẹp mắt cực đơn giản tại nhà	xoi-hoang-pho-deo-thom-mau-vang-dep-mat-cuc-don-gian-tai-nha	Bạn muốn tự tay chuẩn bị món xôi hoàng phố vàng ươm, dẻo thơm cho gia đình? Cùng Vào bếp thực hiện món hấp trứ danh của ẩm thực Hà Nội này nhé. Với công thức chi tiết, tôi hứa bạn sẽ có ngay đĩa xôi bóng mượt, chuẩn vị mâm cỗ truyền thống.	### Hướng dẫn cách nấu: Xôi Hoàng Phố dẻo thơm màu vàng đẹp mắt cực đơn giản tại nhà\n\n**Bước 1: Sơ chế nước cốt nghệ và ngâm gạo**\nBạn lấy 10gr nghệ tươi đem giã nhuyễn, sau đó hòa với một ít nước lọc rồi lọc qua rây để lấy phần nước cốt nghệ vàng. Đem 400gr gạo nếp đãi sạch, cho vào thau rồi đổ nước cốt nghệ vào ngâm, thêm một ít nước cốt chanh để màu sắc đẹp hơn. Tiến hành ngâm gạo trong khoảng 8 tiếng.\n\n**Bước 2: Cách làm hành phi vàng giòn**\nBạn bóc vỏ 20gr hành khô rồi dùng dao thái thành các lát mỏng đều nhau. Sau đó, cho hành vào chảo dầu nóng, phi ở lửa vừa cho đến khi hành chuyển sang màu vàng giòn thì vớt ra để ráo dầu. Phần dầu hành này bạn hãy giữ lại để trộn vào xôi giúp hạt xôi bóng mượt hơn.\n\n**Bước 3: Đồ xôi lần 1**\nVớt gạo nếp đã ngâm đủ thời gian ra rổ và để cho thật ráo nước. Tiếp theo, bạn cho gạo vào bát lớn, thêm một ít muối hạt và 3 thìa dầu vừa phi hành vào rồi dùng thìa trộn thật đều để từng hạt gạo được bao phủ một lớp dầu bóng mượt. Bạn cho 1.5 lít nước vào nồi hấp và đun sôi. Khi nước đã sôi, cho gạo nếp vào xửng hấp xôi, dùng đũa chọc vài lỗ trên bề mặt gạo để hơi nước dễ dàng tỏa đều. Đậy nắp, để lửa nhỏ và đồ xôi trong vòng 30 phút cho hạt gạo chín tới.\n\n**Bước 4: Đồ xôi hai lửa giúp hạt chín dẻo**\nSau khi đồ lần 1, bạn lấy xôi ra bát, rưới thêm một chút dầu hành vào và trộn đều cho hạt xôi tơi. Tiếp tục cho xôi vào xửng hấp lần 2 thêm khoảng 15 - 20 phút nữa cho đến khi hạt xôi chín dẻo hoàn toàn như cách làm xôi vò hạt rời thì tắt bếp.\n\n**Bước 5: Thành phẩm**\nMúc xôi ra đĩa, dùng muôi dàn phẳng rồi rắc đều hành phi và một ít ruốc bông lên trên bề mặt. Món xôi hoàng phố hoàn thành có màu vàng rực rỡ, hạt xôi bóng bẩy, dẻo thơm hòa quyện cùng vị béo của dầu hành và vị đậm đà của ruốc bông, rất phù hợp cho mâm cỗ truyền thống.	15	50	5	Hard	Published	91b2e421-ca53-5b47-90df-1569446ba13d	7c46cda2-3fd0-431a-894f-c0b15881fbfb	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	238
0a801e01-03a1-547c-8ab7-1cfb4dce7e19	Phở bò trộn chua ngọt ngon miệng hấp dẫn chuẩn vị tại nhà	pho-bo-tron-chua-ngot-ngon-mieng-hap-dan-chuan-vi-tai-nha	Chị em nội trợ luôn có nỗi băn khoăn, suy nghĩ làm sao đem đến những món ăn thơm ngon, hấp dẫn cho gia đình mình. Hiểu được điều đó, nên hôm nay Điện máy XANH sẽ mách cho bạn công thức làm món trộn mới lạ mà ai cũng mê mẩn. Cùng bắt tay vào bếp trổ tài làm ngay món phở bò trộn thôi nhé!	### Hướng dẫn cách nấu: Phở bò trộn chua ngọt ngon miệng hấp dẫn chuẩn vị tại nhà\n\n**Bước 1: Sơ chế và ướp thịt bò**\nĐầu tiên, với 200gr thịt bò mua về bạn đem rửa sạch, sau đó lấy khăn ẩm sạch lau sơ qua bề mặt thịt để loại bỏ các bụi bẩn còn sót lại, rồi dùng dao cắt thành từng lát mỏng vừa ăn. Kế đến, bạn lấy cái chén cùng toàn bộ phần thịt bò vừa cắt, 1 muỗng cà phê dầu hào, 1/2 muỗng cà phê hạt nêm, 1/2 muỗng cà phê tiêu xay và 1 muỗng cà phê tỏi băm vào, trộn đều lên rồi để thịt bò được thấm đều gia vị trong vòng 10 phút.\n\n**Bước 2: Sơ chế các nguyên liệu khác**\nCà rốt, đu đủ xanh mua về bạn gọt vỏ, rửa sạch rồi để ráo. Sau đó, dùng dao bào bào cả 2 nguyên liệu thành từng sợi mỏng vừa ăn. Kế đến, lấy tô rồi cho toàn bộ phần cà rốt, đu đủ xanh vừa bào sợi, 2 muỗng canh đường và 2 muỗng canh giấm vào, dùng đũa đảo đều rồi để đồ chua được thấm đều gia vị khoảng 15 - 20 phút. Còn với xà lách, giá đỗ thì bạn bỏ bớt các phần dập úng rồi đem rửa với nước sạch vài lần, để ráo. Cuối cùng, bạn đem xà lách cắt thành từng khúc vừa ăn nữa là được.\n\n**Bước 3: Làm sốt trộn**\nChuẩn bị nguyên liệu xong, bạn lấy chén rồi cho 2 muỗng canh nước mắm, 2 muỗng canh đường, 1 muỗng canh giấm và 6 muỗng canh nước ấm vào, dùng muỗng khuấy đều đến khi hỗn hợp được hòa tan với nhau. Thấy đường đã tan, thì bạn nêm nếm gia vị vừa ăn rồi thêm nốt 1 muỗng cà phê tỏi băm và 1 muỗng cà phê ớt băm vào, đảo đều lên lần nữa là được rồi nhé!\n\n**Bước 4: Xào bò**\nKế đến, bắc chảo lên bếp cùng 2 muỗng canh dầu ăn và 2 muỗng cà phê tỏi băm còn lại vào phi thơm với lửa vừa. Sau đó, cho 200gr thịt bò đã ướp vào, dùng đũa xào đều khoảng 3 phút. Cuối cùng, bạn tiếp tục thêm nốt 150gr giá đỗ đã rửa vào, đảo đều 3 phút nữa rồi nêm nếm gia vị vừa ăn, tắt bếp cho ra dĩa.\n\n**Bước 5: Hoàn thành**\nChuẩn bị nguyên liệu xong, bạn lấy tô rồi lần lượt cho rau xà lách đã rửa, bánh phở, đồ chua, thịt bò vừa xào cùng giá đỗ, đậu phộng rang và 1 ít nước sốt trộn vào, trộn đều lên nữa là thưởng thức được rồi nhé!\n\n**Bước 6: Thành phẩm**\nPhở bò trộn không nhiều dầu mỡ sẽ là sự lựa chọn lý tưởng mà bạn có thể dành tặng cho các thành viên trong gia đình mình để đổi vị. Hương thơm thoang thoảng từ thịt bò mềm ngọt lại còn đậm đà thật cuốn hút. Đặc biệt, khi kết hợp cùng bún tươi trắng nõn, đồ chua chua chua ngọt ngọt và xà lách tươi xanh làm cho ăn mãi mà không biết ngán là gì. À mà sự thơm ngon ấy làm sao thiếu được chén nước sốt trộn mặn ngọt cay cay nơi đầu lưỡi được. Ngoài ra, bạn còn có thể chuẩn bị thêm 1 ít rau thơm để ăn cùng nữa nhé!	20	30	2	Easy	Published	df8ce4d2-203d-489f-89b8-91629c4f610e	078bf482-fe40-4efb-9281-4ae88d007f46	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	155
7a541a1d-207a-515c-93c3-2424f0c1d745	Bún chả chan thơm ngon đậm đà tại nhà chuẩn vị như ngoài hàng	bun-cha-chan-thom-ngon-dam-da-tai-nha-chuan-vi-nhu-ngoai-han	Bạn đã thử bún chả chan chưa? Cùng Vào bếp học cách làm bún chả chan thanh ngọt hấp dẫn. Món nước này là sự kết hợp giữa thịt nướng thơm lừng và nước dùng xương đậm đà, chuẩn vị ẩm thực Hà Nội ngay tại nhà.	### Hướng dẫn cách nấu: Bún chả chan thơm ngon đậm đà tại nhà chuẩn vị như ngoài hàng\n\n**Bước 1: Sơ chế nguyên liệu**\nThịt ba chỉ chà xát với muối hạt rồi rửa sạch. Thái thịt thành các lát mỏng khoảng 0.5cm. Sả cây bạn bào mỏng rồi băm nhuyễn. Tỏi bạn cũng băm nhỏ. Hành tím thì lấy 3 củ để băm nhỏ. Hành lá thì bạn cắt riêng phần lá và phần gốc hành. Lá hành bạn thái nhỏ, gốc hành thì chẻ sợi nhỏ. Bạn rửa sạch cà chua rồi cắt nhỏ vừa.\n\n**Bước 2: Ướp thịt và chả nướng**\nBạn cho thịt xay và thịt thái lát vào 2 tô lớn khác nhau. Ướp vào mỗi tô các gia vị với định lượng như sau: 1/2 thìa canh nước hàng, 1 thìa canh dầu hào, 1 thìa canh nước mắm, 1 thìa canh sữa đặc, 1 thìa cà phê đường, 2 thìa canh dầu ăn và một ít tiêu đen. Cuối cùng cho thêm hành tím, tỏi, sả đã băm nhỏ vào mỗi tô rồi trộn đều. Bạn nhớ để lại một ít tỏi băm để xào cà chua nhé. Ướp thịt từ 15 - 20 phút để gia vị thấm sâu.\n\n**Bước 3: Nướng chả**\nLàm nóng nồi chiên không dầu ở 200 độ C trong vòng 7 phút. Bạn chia nhỏ phần thịt băm rồi nặn thành các viên chả vừa phải. Xếp chả viên và chả thịt vào nồi, tiến hành nướng lần 1 ở 200 độ C trong 15 phút. Sau đó, bạn trở mặt chả, giữ nguyên nhiệt độ và nướng tiếp lần 2 trong 6 phút.\n\n**Bước 4: Nấu nước dùng bún chả chan**\nBạn rửa sạch xương heo, chần sơ xương trong nước sôi khoảng 2 - 3 phút rồi vớt ra, rửa lại cho sạch. Cho xương vào nồi, cho thêm 2.5 lít nước, 2 củ hành tím và 1 thìa cà phê muối vào nồi. Tiến hành ninh xương trong khoảng 30 - 60 phút cho xương tiết nước ngọt. Bắc chảo lên bếp, cho vào chảo 1 thìa canh dầu ăn rồi cho tỏi vào, phi thơm. Tiếp đến, bạn cho cà chua vào, xào trong khoảng 5 phút, cho đến khi cà chua mềm nhừ. Bạn trút phần cà chua xào vào nồi nước dùng, nêm thêm 1/2 thìa canh hạt nêm, 1 thìa canh nước mắm và 1 thìa cà phê mì chính. Nêm nếm gia vị lại cho hợp khẩu vị gia đình.\n\n**Bước 5: Thành phẩm**\nCho bún rối vào tô, xếp các viên chả nướng lên trên cùng hành lá thái nhỏ và các loại rau sống tươi ngon. Cuối cùng, dội nước dùng bún chả chan nóng hổi vào tô rồi thưởng thức. Món ăn đạt yêu cầu khi nước dùng có vị ngọt thanh, thịt nướng thơm phức hòa quyện cùng vị tươi mát của rau sống, tạo nên một hương vị khó quên.	30	85	2	Easy	Published	df8ce4d2-203d-489f-89b8-91629c4f610e	573f12df-dbdb-40b0-82f9-bd52ca5c972c	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	239
a42c812f-4e4a-5ce4-b574-d95c084350f8	Hủ tiếu hấp An Giang, đặc sản miền Tây chuẩn vị đơn giản tại nhà	hu-tieu-hap-an-giang-dac-san-mien-tay-chuan-vi-don-gian-tai-	Hủ tiếu hấp Kiên Giang là món trộn độc đáo kết hợp giữa sợi hủ tiếu dai mềm được hấp cách thủy, ăn kèm thịt khìa, bì trộn, chả giò và nước cốt dừa béo ngậy. Hãy cùng Vào bếp ngay để khám phá công thức chuẩn vị miền Tây này nhé!	### Hướng dẫn cách nấu: Hủ tiếu hấp An Giang, đặc sản miền Tây chuẩn vị đơn giản tại nhà\n\n**Bước 1: Chế biến sợi hủ tiếu dai**\nTrộn 200 gr bột gạo, 60 gr bột năng với nước lạnh và một chút muối, khuấy đều cho tan hoàn toàn. Để hỗn hợp nghỉ 1 đêm, sau đó chắt bỏ lớp nước chua bên trên, thêm 350ml nước mới rồi khuấy đều.\n\n**Bước 2: Hấp chín và cắt sợi hủ tiếu**\nChuẩn bị 1 nồi hấp, đổ 1 lớp bột mỏng vào khay và hấp trong 10 phút, sau đó lấy ra và quét mỏng lớp dầu lên mặt bánh. Bạn tiếp tục hấp mẻ mới cho đến khi đủ số lượng bánh, sau đó cắt bánh thành sợi hủ tiếu.\n\n**Bước 3: Sơ chế nhân tôm và bì thịt**\nTôm rang chín với ít muối, bóc vỏ và băm nhỏ thịt tôm. Phi thơm tỏi băm, cho tôm vào xào chín tới. Chuẩn bị thêm thịt heo khìa rồi thái sợi. Bì heo làm sạch, trộn đều cùng tỏi băm và thính gạo.\n\n**Bước 4: Làm chả giò khoai môn tôm thịt**\nChuẩn bị phần nhân gồm 1/2 củ khoai môn bào, 1 củ cà rốt bào, 200 gr thịt băm, 100 gr tôm băm, 1 lọn bún tàu, 1 quả trứng gà, 1 muỗng hành tím và tỏi băm. Trộn đều nhân và chô vào bánh tráng, gói lại rồi đem chiên vàng giòn.\n\n**Bước 5: Thành phẩm**\nKhi ăn, bạn lấy hủ tiếu hấp nóng cho vào tô, dùng kèm dưa leo bào, giá sống, đồ chua, bì trộn, thịt khìa, tôm xào và chả giò chiên. Điểm xuyến thêm vị béo của nước cốt dừa, giòn béo của đậu phộng, hoà quyện cùng nước mắm tỏi ớt chua ngọt, tạo nên hương vị đặc trưng, ấn tượng khó quên.	40	60	4	Hard	Published	df8ce4d2-203d-489f-89b8-91629c4f610e	456e6fad-7dc8-4695-8063-23bf6e2c73f3	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	96
13627a6f-e0c2-5c41-88b5-6bc66344b541	Hủ tiếu pate Bến Tre thơm ngon chuẩn vị như ngoài hàng cho cả nhà	hu-tieu-pate-ben-tre-thom-ngon-chuan-vi-nhu-ngoai-hang-cho-c	Hủ tiếu pate Bến Tre là món nước đặc sản độc đáo ở Bến Tre với sợi hủ tiếu dai ngon, nước dùng thanh ngọt hòa quyện cùng những miếng pate chuẩn miền Tây dai giòn sần sật. Cùng Vào bếp để khám phá ngay hương vị lạ miệng, đậm đà khó quên của món ăn trứ danh xứ dừa này!	### Hướng dẫn cách nấu: Hủ tiếu pate Bến Tre thơm ngon chuẩn vị như ngoài hàng cho cả nhà\n\n**Bước 1: Sơ chế và rang nguyên liệu**\nRang vàng khô mực, tôm khô và củ hành tím để dậy mùi thơm. Sau đó rửa sạch và cho tất cả vào túi lọc gia vị.\n\n**Bước 2: Trụng xương và phèo**\nTrụng xương heo và phèo với nước sôi có pha chút gừng để loại bỏ tạp chất, giúp nước dùng khi nấu sẽ trong và thanh hơn.\n\n**Bước 3: Nấu nước dùng hủ tiếu**\nCho xương, phèo, túi lọc gia vị, củ cải trắng vào nồi nước và ninh lửa nhỏ trong 2 - 4 giờ đồng hồ. Trong lúc ninh xương, bạn nhớ vớt bọt thường xuyên để nước dùng trong. Sau khi ninh xong, bạn nêm đường phèn, muối, hạt nêm, bột ngọt, nước mắm và đường cát cho vừa với khẩu vị của gia đình. Sau đó cho thêm cà rốt tỉa hoa vào nấu chín. Mẹo nhỏ: Bạn có thể dùng nồi áp suất để ninh xương sẽ tiết kiệm thời gian hơn, chỉ với 20 - 30 phút hầm là đã có ngay nước dùng ngọt thanh rồi.\n\n**Bước 4: Chuẩn bị pate và các món kèm**\nPate cắt miếng dày để không bị rã khi ăn. Gốc hành cắt khúc, lá hành cắt nhuyễn. Bạn chuẩn bị thêm chanh, ớt để ăn kèm.\n\n**Bước 5: Thành phẩm**\nTrình bày hủ tiếu ra tô, xếp pate lên trên, chan nước dùng nóng hổi vào. Hủ tiếu pate Bến Tre với sợi hủ tiếu dai, nước dùng ngọt thanh và pate béo ngậy chắc chắn sẽ làm bạn hài lòng.	30	240	4	Hard	Published	df8ce4d2-203d-489f-89b8-91629c4f610e	98ec81e8-21ab-41be-a3f2-cdf05dfcc8b5	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	141
4e38d2f2-95fe-54b4-be87-08b700da58cb	Bánh tráng heo quay bằng nồi chiên không dầu giòn rụm tại nhà	banh-trang-heo-quay-bang-noi-chien-khong-dau-gion-rum-tai-nh	Mê mẩn món bánh tráng heo quay giòn rụm? Chuyên mục Vào bếp hôm nay sẽ bật mí cách làm bánh tráng cuốn thịt heo quay chuẩn vị, bì nổ giòn tan ngay tại nhà. Đảm bảo món cuốn - trộn này sẽ khiến cả nhà bạn thích mê!	### Hướng dẫn cách nấu: Bánh tráng heo quay bằng nồi chiên không dầu giòn rụm tại nhà\n\n**Bước 1: Luộc sơ và sơ chế bì heo quay**\nĐầu tiên, bạn chuẩn bị một nồi nước, cho 20gr gừng và 3 cây sả đập dập vào đun sôi. Sau đó, bạn cho 1.2kg thịt ba chỉ vào luộc sơ trong khoảng 2 phút để thịt sạch và săn lại. Sau khi vớt ra, bạn dùng dụng cụ xăm thịt hoặc đầu tăm nhọn xăm thật kỹ và đều khắp phần bì heo. Tiếp theo, bạn đặt miếng thịt vào đĩa có chứa hỗn hợp 100ml giấm và 10gr muối tinh sao cho phần bì được ngâm trong hỗn hợp này khoảng 5 phút. Cuối cùng, bạn dùng khăn giấy sạch thấm thật khô bề mặt bì heo.\n\n**Bước 2: Quay thịt bằng nồi chiên không dầu**\nBạn sử dụng giấy bạc lót xung quanh miếng thịt, chỉ để lộ phần bì hướng lên trên. Sau đó, bạn phủ một lớp 300gr muối hột dày lên trên mặt bì heo. Bạn cho thịt vào nồi chiên không dầu nướng lần 1 ở nhiệt độ 120 độ C trong vòng 30 phút. Sau khi kết thúc lần 1, bạn lấy thịt ra, gạt bỏ hoàn toàn lớp muối hột trên bề mặt, sau đó dùng cọ quét một lớp dầu ăn mỏng lên bì. Bạn tiếp tục cho thịt vào nồi nướng lần 2 ở nhiệt độ 200 độ C trong 35 phút cho đến khi bì nổ đều, vàng ruộm và giòn tan.\n\n**Bước 3: Làm nước chấm mắm nêm**\nTrong lúc nướng thịt, bạn bắc chảo lên bếp và phi thơm 1 ít tỏi băm cùng 150gr dứa băm nhỏ. Tiếp theo, bạn đổ 200ml mắm nêm nguyên chất vào chảo cùng khoảng 100ml nước lọc. Bạn thêm 50gr đường và 10gr bột ngọt vào (điều chỉnh lượng đường tùy theo độ chua của dứa và khẩu vị gia đình), đun sôi hỗn hợp rồi tắt bếp, để nguội.\n\n**Bước 4: Chuẩn bị rau củ và hoàn thiện**\nBạn rửa sạch 2 cây xà lách và các loại rau thơm, ngò. 2 củ cà rốt, 2 quả dưa leo và phần dứa còn lại đem gọt vỏ rồi thái sợi dài vừa ăn. Khi thịt heo quay đã đạt độ giòn, bạn lấy ra khỏi nồi chiên và thái thành những miếng mỏng dài vừa ăn. Cuối cùng, bạn bày thịt quay, bún tươi, rau củ và mắm nêm ra mâm để cả nhà cùng cuốn và thưởng thức món bánh tráng heo quay hấp dẫn này.\n\n**Bước 5: Thành phẩm**\nMiếng thịt heo quay đạt chuẩn sẽ có lớp bì vàng ươm, nổ giòn rụm như bánh đa, phần thịt nạc và mỡ bên trong vẫn mềm và giữ được độ ngọt. Khi cuốn cùng bánh tráng, bún tươi, rau sống và chấm cùng mắm nêm đậm đà vị dứa, bạn sẽ cảm nhận được sự hòa quyện hoàn hảo giữa các hương vị.	20	70	4	Hard	Published	6a4c6042-201b-5659-b112-66e1d54def79	a343771d-bafb-4a55-9459-2739d0b00a20	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	103
af002a60-e2a8-5f3a-b595-ad6bb4dfba0d	Cơm âm phủ chuẩn vị Huế đơn giản ngay tại nhà!	com-am-phu-chuan-vi-hue-don-gian-ngay-tai-nha	Bạn đang tìm cách làm cơm âm phủ chuẩn vị Huế? Món trộn đầy màu sắc này sẽ khiến cả nhà mê mẩn! Cùng Vào bếp thực hiện ngay công thức chi tiết, biến tấu món ăn Huế hấp dẫn này thành bữa cơm khó quên.	### Hướng dẫn cách nấu: Cơm âm phủ chuẩn vị Huế đơn giản ngay tại nhà!\n\n**Bước 1: Nấu cơm và sơ chế nguyên liệu**\nĐầu tiên, bạn cho 350 gr gạo tẻ vào nồi và nấu cơm như cách bạn vẫn thường nấu ở nhà. Trong lúc chờ cơm chín, bạn băm nhuyễn 4 tép tỏi và 4 trái ớt. Cà rốt (100 gr) bạn bào sợi rồi cho vào tô. Tôm (50 gr) đã lột vỏ và rút chỉ đen, bạn băm nhuyễn hoặc xay nhuyễn, sau đó ướp với một ít hạt nêm và một ít tiêu xay. Trộn đều và ướp khoảng 15 phút. Chả lụa (250 gr) bạn xắt sợi nhuyễn. Dưa leo (1 trái) bạn xắt lát mỏng. Rau thơm (húng quế, húng lủi, ngò rí) bạn xắt nhuyễn.\n\n**Bước 2: Ướp thịt ba rọi**\nThịt heo ba rọi (250 gr) bạn cắt lát mỏng khoảng 1 cm. Cho thịt vào tô, ướp với một ít tỏi và ớt băm nhuyễn, 1 muỗng canh hạt nêm, nửa muỗng canh nước mắm và một ít đường. Trộn đều các nguyên liệu và ướp khoảng 20 phút để thịt thấm gia vị.\n\n**Bước 3: Làm đồ chua cà rốt giòn ngon**\nCà rốt đã bào sợi bạn cho vào tô. Thêm 2 muỗng canh đường, 2 muỗng canh giấm và một ít muối. Trộn đều hỗn hợp và ướp khoảng 1 đến 2 tiếng là có thể dùng được.\n\n**Bước 4: Pha nước mắm chua ngọt đậm đà**\nTrong lúc chờ các nguyên liệu ướp, bạn chuẩn bị nước mắm. Cho 4 muỗng canh nước sôi vào chén, thêm 2 muỗng canh nước mắm, 1 muỗng canh nước cốt chanh và 2 muỗng canh đường. Khuấy đều cho đường tan hoàn toàn, sau đó cho phần tỏi ớt băm nhuyễn vào.\n\n**Bước 5: Chiên thịt và trứng vàng ươm**\nChiên thịt: Làm nóng chảo với một ít dầu ăn. Cho thịt ba rọi đã ướp vào chiên với lửa vừa, trở đều các mặt cho đến khi miếng thịt chín vàng đều. Gắp thịt ra, xắt sợi nhuyễn. Chiên trứng: Đập 2 quả trứng gà vào tô, thêm một ít hạt nêm và tiêu, đánh đều. Làm nóng chảo với một ít dầu, lắc nhẹ để dầu tráng đều chảo rồi cho trứng vào chiên thật mỏng với lửa nhỏ cho đến khi trứng chín đều. Cuộn trứng lại và xắt sợi nhuyễn.\n\n**Bước 6: Cháy tôm và làm mỡ hành thơm lừng**\nCháy tôm: Cho một ít dầu ăn vào chảo, sau đó cho tôm băm đã ướp vào. Xào đều cho đến khi tôm săn lại và khô là được. Làm mỡ hành: Hành lá xắt nhuyễn cho vào chén, thêm một ít muối và một ít đường. Đun dầu ăn thật sôi rồi chế ngay vào chén hành, khuấy đều để hành chín và có màu xanh đẹp mắt.\n\n**Bước 7: Thành phẩm**\nCơm đã nấu chín bạn múc ra chén rồi úp ngược vào giữa dĩa. Tiếp theo, bạn xếp các nguyên liệu đã sơ chế và chế biến (thịt chiên, trứng chiên, chả lụa, dưa leo, cà rốt ngâm chua, rau thơm) xung quanh phần cơm, mỗi thứ một ít vừa đủ ăn. Cho một ít tôm cháy lên trên mặt cơm. Cuối cùng, cho mỡ hành vào giữa phần cơm. Khi ăn, bạn chỉ cần trộn đều tất cả các nguyên liệu và chan nước mắm chua ngọt đã pha là có thể thưởng thức ngay.	20	45	2	Hard	Published	6a4c6042-201b-5659-b112-66e1d54def79	852cc4dc-913d-4d95-8962-4c5407d77d3c	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	77
fcb19486-2256-5ad6-a6a9-729b29adcbae	Bánh cuốn Quảng Đông mềm mượt, thơm ngon chuẩn vị đơn giản tại nhà	banh-cuon-quang-dong-mem-muot-thom-ngon-chuan-vi-don-gian-ta	Bạn đang tìm kiếm cách làm bánh cuốn Quảng Đông chuẩn vị? Cùng Vào bếp khám phá bí quyết tạo nên món bánh cuốn mềm mại, thơm ngon khó cưỡng! Với công thức này, món hấp yêu thích của bạn sẽ thành công ngay lần đầu, đảm bảo cả nhà đều mê!	### Hướng dẫn cách nấu: Bánh cuốn Quảng Đông mềm mượt, thơm ngon chuẩn vị đơn giản tại nhà\n\n**Bước 1: Pha bột làm bánh cuốn mềm mượt**\nĐầu tiên, chúng ta sẽ bắt tay vào pha bột để có được những chiếc bánh cuốn mềm mại nhất. Trong một tô lớn, bạn cho 120gr bột gạo, 30gr bột năng và 30gr bột tàn mì vào. Thêm 1/2 muỗng cà phê muối và 1 muỗng canh dầu ăn (dầu phi hành sẽ giúp bánh thơm hơn). Từ từ cho 320ml nước lạnh vào, khuấy đều cho bột tan hết. Cuối cùng, đổ thêm 240ml nước sôi vào, khuấy nhanh tay cho hỗn hợp bột mịn màng.\n\n**Bước 2: Chuẩn bị nước chấm bánh cuốn đậm đà**\nTrong lúc đợi bột nghỉ, chúng ta sẽ pha nước sốt chấm, linh hồn của món bánh cuốn Quảng Đông. Cho 1 muỗng cà phê đường vào chén, thêm 2 muỗng canh nước sôi và khuấy đều cho đường tan hoàn toàn. Sau đó, cho 2 muỗng canh nước tương, 1 muỗng cà phê dầu mè và một ít sa tế (điều chỉnh theo khẩu vị) vào. Khuấy đều để các nguyên liệu hòa quyện, tạo nên hương vị nước chấm tuyệt vời.\n\n**Bước 3: Sơ chế nhân thịt và trứng gà**\nHành lá rửa sạch, cắt riêng phần cọng trắng để ướp vào thịt xay, còn phần lá xanh thì thái nhỏ cho vào tô bột bánh. Cho 226gr thịt xay vào tô, thêm tiêu, 1/2 muỗng cà phê bột nêm chay, một chút đường, 1 muỗng cà phê lưng bột bắp và một chút xíu dầu ăn. Cho thêm phần cọng hành trắng đã cắt vào, trộn đều tất cả các nguyên liệu. Đánh tan 3 quả trứng gà trong một chén riêng.\n\n**Bước 4: Hấp bánh cuốn Quảng Đông thơm ngon**\nChuẩn bị nồi hấp: Đổ nước vào nồi hấp (hoặc chảo sâu lòng), đun sôi. Dùng dầu phi hành thoa đều 3 khuôn hấp. Khi nước trong nồi đã sôi, đặt các khuôn đã thoa dầu vào để khuôn nóng. Lấy khuôn ra, cho khoảng 1 muỗng cà phê thịt xay đã ướp lên, dàn mỏng đều. Quậy đều tô bột, múc một vá bột đổ lên trên lớp nhân thịt, tráng đều và mỏng. Múc một muỗng trứng gà đã đánh rưới lên mặt bột. Đặt khuôn trở lại nồi hấp, đậy nắp và hấp khoảng 2 phút. Lấy bánh ra, để nguội bớt rồi dùng dụng cụ lấy bánh ra khỏi khuôn một cách nhẹ nhàng. Tiếp tục lặp lại quy trình cho đến khi hết bột và nhân.\n\n**Bước 5: Thành phẩm**\nSau khi hấp xong các mẻ bánh, bạn nhẹ nhàng xếp bánh ra dĩa. Rắc thêm hành phi giòn rụm và hành lá thái nhỏ lên trên để trang trí cho món ăn thêm phần hấp dẫn. Nếu muốn, bạn có thể cắt bánh thành miếng vừa ăn. Cuối cùng, chan nước sốt chấm đã pha lên bánh và thưởng thức ngay khi còn nóng. Món bánh cuốn Quảng Đông mềm mại, thơm ngon đã sẵn sàng để bạn chiêu đãi cả nhà!	20	40	2	Hard	Published	6a4c6042-201b-5659-b112-66e1d54def79	cc06a093-474f-4659-9db0-ed4c708e2978	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	153
3bbbcc86-91fd-5ca5-8764-5cecc511ff41	2 cách làm bánh xèo miền Bắc thơm ngon giòn rụm chuẩn vị dễ làm tại nhà	2-cach-lam-banh-xeo-mien-bac-thom-ngon-gion-rum-chuan-vi-de-	Bánh xèo là một món ăn bình dị nhưng rất hấp dẫn, thơm ngon. Mỗi vùng miền sẽ có cách làm bánh xèo riêng. Hôm nay, Điện máy XANH sẽ hướng dẫn các bạn 2 cách làm bánh xèo miền Bắc để chiêu đãi cả nhà vào những dịp cuối tuần. Cùng vào bếp thực hiện món bánh này nhé!	### Hướng dẫn cách nấu: 2 cách làm bánh xèo miền Bắc thơm ngon giòn rụm chuẩn vị dễ làm tại nhà\n\n**Bước 1: Trộn bột bánh xèo**\nCho vào tô 500gr bột bánh xèo cốt dừa, 100ml bia, 1 muỗng cà phê muối, 1/3 muỗng cà phê bột nghệ, 1/2 muỗng cà phê bột ngọt, 2 quả trứng gà, 50gr hành lá cắt nhỏ, 450ml nước lọc. Khuấy đều hỗn hợp đến khi bột tan hoàn toàn.\n\n**Bước 2: Chuẩn bị nhân bánh xèo**\nĐầu tiên, bạn rửa sạch tôm, lột vỏ và bỏ chỉ đen. Sau đó, lột vỏ hành tây rồi thái sợi. Đem 50gr nấm hương đi ngâm mềm, rửa lại với nước sạch rồi cắt nhỏ. Kế đến, lột vỏ tỏi và hành tím, rửa sơ rồi băm nhỏ. Cà rốt gọt vỏ, rửa sạch rồi bào sợi, chừa lại 1 ít để cắt khoanh nhỏ làm nước mắm.\n\n**Bước 3: Xào nhân bánh xèo**\nBắc chảo lên bếp, cho vào chảo 1 ít dầu ăn rồi cho hành tím băm vào phi thơm. Khi hành thơm, bạn cho tôm, thịt vào chảo cùng 1/2 muỗng cà phê tiêu, 1/2 muỗng cà phê bột ngọt, 1/3 muỗng cà phê muối, 1 muỗng cà phê nước mắm. Xào đều nhân với lửa vừa đến khi chín hoàn toàn. Kế đến, cho vào chảo hành tây, cà rốt, nấm hương và tiếp tục xào đến khi rau củ chín.\n\n**Bước 4: Đổ bánh xèo**\nBắc chảo mới lên bếp, cho vào 1 ít dầu ăn và làm nóng. Khi dầu nóng, bạn cho vào 1 ít hỗn hợp bột bánh rồi tráng thật đều. Kế đến, cho nhân lên trên lớp bột bánh, dàn đều phần nhân và cho 1 ít giá lên mặt bánh rồi gấp đôi bánh lại. Chiên bánh với lửa nhỏ đến khi 2 mặt vàng giòn.\n\n**Bước 5: Làm nước chấm bánh xèo**\nCho vào tô 3 muỗng canh nước mắm, 6 muỗng canh nước lọc, 1/4 muỗng cà phê bột ngọt, 5 muỗng cà phê đường, nước cốt của 2 quả chanh, 2 muỗng cà phê giấm, 1 ít tiêu, cà rốt cắt khoanh, 1 ít tỏi, ớt băm. Khuấy đều hỗn hợp đến khi đường tan là hoàn tất. Bạn có thể nêm nếm lại hoặc thêm ớt cho phù hợp với khẩu vị gia đình.\n\n**Bước 6: Thành phẩm**\nBánh xèo miền Bắc với nấm hương có lớp vỏ giòn rụm, thơm nhẹ ăn kèm cùng nhân tôm thịt bùi béo và rau củ ngọt thanh, chấm với nước mắm chua ngọt, cay cay, siêu ngon miệng.\n\n**Bước 7: Sơ chế nguyên liệu**\nTrước tiên, rửa sạch tôm, bóc vỏ, bỏ chỉ đen rồi ướp với 1/2 muỗng cà phê muối, 1 muỗng cà phê hạt nêm, 1 muỗng cà phê tiêu, 1 muỗng cà phê đường. Còn thịt thì bạn rửa sạch, cắt mỏng rồi ướp cùng 1/2 muỗng cà phê muối, 1 muỗng cà phê hạt nêm, 1 muỗng cà phê tiêu. Rửa sạch ớt và 2 tép tỏi đã bóc vỏ sau đó băm nhuyễn. Hành tím đem bóc vỏ, rửa sạch rồi băm nhỏ. Bạn rửa sạch hành lá sau đó cắt nhỏ, còn giá và rau sống ăn kèm thì bạn nhặt bỏ phần hư hoặc dập nát, sau đó rửa sạch rồi để ra rổ cho ráo nước.\n\n**Bước 8: Pha bột**\nCho vào tô 500gr bột bánh xèo cùng 100g bột chiên giòn. Sau đó cho vào tô bột 1/2 muỗng cà phê bột nghệ, phần hành lá cắt nhỏ, 500ml nước lọc, 500ml bia, 100ml nước cốt dừa rồi khuấy đều cho bột tan. Bạn để cho bột nghỉ trong 1 giờ.\n\n**Bước 9: Pha nước mắm**\nCho vào chén phần tỏi ớt đã băm nhuyễn cùng 2 muỗng canh đường, 2 muỗng canh nước mắm, 2 muỗng canh nước cốt chanh, 2 muỗng canh nước lọc rồi dùng muỗng trộn đều cho nước mắm hòa tan. Bạn có thể nêm nếm lại nước mắm cho phù hợp với khẩu vị gia đình.\n\n**Bước 10: Xào nguyên liệu**\nBắc chảo lên bếp, cho 2 muỗng canh dầu ăn vào chảo. Khi dầu nóng lên, cho hành tím băm nhỏ vào phi thơm rồi cho tôm đã ướp vào xào chín. Sau khi tôm chín, bạn cho ra tô rồi tiếp tục xào thịt tương tự như vậy.\n\n**Bước 11: Đổ bánh xèo**\nBắc một cái chảo chống dính lên bếp. Quét 1 lớp dầu mỏng, sau khi chảo nóng thì đổ 1 lớp bột thật mỏng, láng đều bột khắp mặt chảo. Tiếp đến, bạn cho thêm tôm, thịt đã xào chín và giá vừa đủ vào. Để lửa vừa và đợi cho vỏ bánh bắt đầu chín vàng thì gập đôi bánh lại. Quét thêm ít dầu ăn rồi chiên kĩ 2 mặt để bánh vàng giòn.\n\n**Bước 12: Thành phẩm**\nMón bánh xèo miền Bắc với màu vàng mướt mắt, hương thơm hấp dẫn đã hoàn thành. Lớp vỏ giòn rụm cùng phần nhân thơm ngon chắc chắn sẽ khiến bạn thích mê. Bạn có thể ăn kèm với rau xà lách, cải xanh và rau thơm cho món ăn thơm ngon và đỡ ngấy.	60	20	6	Easy	Published	6a4c6042-201b-5659-b112-66e1d54def79	e95303ad-ac74-4ab2-88e7-e989ae0f17a4	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	303
9622b506-a920-5848-a276-56f99355fc69	Bắp bò nhúng mẻ chua thanh thơm ngon hấp dẫn cực đơn giản tại nhà	bap-bo-nhung-me-chua-thanh-thom-ngon-hap-dan-cuc-don-gian-ta	Vào bếp ngay với công thức bắp bò nhúng mẻ chua thanh, mềm ngọt khó cưỡng! Món lẩu hấp dẫn này sẽ mang đến trải nghiệm ẩm thực tuyệt vời cho gia đình bạn. Đảm bảo thành công ngay lần đầu, chiêu đãi cả nhà món ngon chuẩn vị!	### Hướng dẫn cách nấu: Bắp bò nhúng mẻ chua thanh thơm ngon hấp dẫn cực đơn giản tại nhà\n\n**Bước 1: Sơ chế và thái mỏng bắp bò**\nĐể thái thịt bò mỏng và đẹp mắt hơn, bạn nên cho miếng bắp bò vào ngăn đông tủ lạnh khoảng 30 - 45 phút cho đến khi thịt đông được khoảng 80%. Sau đó, lấy ra và dùng dao sắc thái thịt thành những lát thật mỏng. Miếng thịt bò nhúng mẻ sẽ mềm và ngon hơn khi thái mỏng.\n\n**Bước 2: Pha chế mắm nêm chấm kèm đậm đà**\nChuẩn bị một tô sạch, cho chén mắm nêm pha sẵn vào. Thêm khoảng 2 - 3 muỗng cà phê đường tùy theo khẩu vị gia đình bạn. Băm nhỏ 1/2 quả thơm (dứa) và 1 ít tỏi ớt băm, sau đó cho tất cả vào tô mắm nêm. Vắt thêm 1/2 quả chanh để tạo vị chua thanh. Khuấy đều cho các gia vị tan hết và hòa quyện vào nhau, tạo nên chén nước chấm thơm lừng, đậm đà.\n\n**Bước 3: Nấu hỗn hợp gia vị**\nSơ chế 3 nhánh sả: 1 nhánh băm nhỏ, 2 nhánh còn lại đập dập và cắt khúc. Bóc vỏ, rửa sạch 1 củ hành tây và 1 củ hành tím, sau đó cắt khoanh lớn. Ớt cắt khoanh. Bắc một chiếc chảo lên bếp, cho một ít dầu ăn vào đun nóng. Phi thơm sả băm, tỏi băm và ớt khoanh cho dậy mùi. Nêm vào chảo 2 muỗng canh nước mắm, 2 muỗng canh đường, 1/3 muỗng canh hạt nêm, 1/3 muỗng canh bột ngọt, 1/3 muỗng canh muối. Tiếp đến, cho khoảng 1 chén nước lọc vào, đun sôi nhẹ để các gia vị hòa quyện.\n\n**Bước 4: Pha nấu nước nhúng mẻ chua thanh**\nTrong một chiếc nồi khác, đổ khoảng 1 - 2 lít nước lọc (hoặc nước dừa để tăng thêm độ ngọt tự nhiên) vào nồi. Cho hành tây, hành tím cắt khoanh và sả cắt khúc vào. Tiếp theo, đổ hỗn hợp gia vị vừa nấu vào nồi và đun sôi. Khi nước đã sôi bùng, cho cơm mẻ vào một chiếc rây. Nhúng rây vào nồi và dùng muỗng tán đều để lấy phần nước cốt chua. Bỏ đi phần bã mẻ. Nêm nếm lại nước dùng cho hợp khẩu vị gia đình, đảm bảo vị chua thanh đặc trưng của món bắp bò nhúng mẻ.\n\n**Bước 5: Thành phẩm**\nĐặt nồi nước dùng mẻ lên bếp ga mini hoặc bếp điện giữa bàn ăn. Khi nước sôi bùng, bạn nhúng từng lát bắp bò đã thái mỏng vào cho vừa chín tới. Thịt bò chín nhanh sẽ giữ được độ mềm ngọt tự nhiên. Cuốn thịt bò cùng bánh tráng, các loại rau sống tươi ngon (xà lách, dưa leo, thơm, rau thơm các loại) và chấm một chút mắm nêm đậm đà đã pha sẵn. Món lẩu bắp bò nhúng mẻ chua thanh này có thể ăn kèm bún tươi như một món lẩu truyền thống hoặc cuốn bánh tráng đều ngon tuyệt. Đây chắc chắn sẽ là món nhậu lý tưởng cho những buổi tụ họp.	30	20	4	Hard	Published	db628456-1e16-4c67-bd2a-6d297d718ef9	ca9773bc-2065-432d-bde5-43001b2e1415	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	158
1ee41201-7d04-589a-9705-08cef1ff4ce3	Lẩu bò nhúng giấm (dấm) nóng hổi thơm ngon cực đơn giản tại nhà	lau-bo-nhung-giam-dam-nong-hoi-thom-ngon-cuc-don-gian-tai-nh	Nếu bạn vẫn đang băn khoăn chưa biết trổ tài làm món gì vào dịp cuối tuần để các thành viên quây quần bên nhau thì Điện máy XANH sẽ giới thiệu đến bạn công thức món lẩu siêu hấp dẫn sau đây! Nào cùng bắt tay vào bếp thực hiện ngay một nồi lẩu bò nhúng giấm (dấm) thơm ngon, bổ dưỡng thôi nào!	### Hướng dẫn cách nấu: Lẩu bò nhúng giấm (dấm) nóng hổi thơm ngon cực đơn giản tại nhà\n\n**Bước 1: Sơ chế thịt bò**\nĐầu tiên, thịt bò mua về bạn đem rửa sơ với nước. Kế đến, dùng khăn ẩm sạch lau sơ trên bề mặt để sạch hết các bụi bẩn còn bám lại. Sau đó, dùng dao thái theo thớ ngang thành các lát mỏng vừa ăn.\n\n**Bước 2: Sơ chế các nguyên liệu khác**\nThơm mua về bạn gọt vỏ, đồng thời loại khứa bỏ sạch mắt thơm, sau đó rửa sơ với nước cho sạch, để ráo, rồi dùng dao cắt làm 2 phần, 1 phần cắt lát mỏng, 1 phần băm nhuyễn. Sả thì bạn cắt gốc, rứa sạch rồi đập dập, cắt khúc. Tỏi, hành tím bạn lột vỏ, ớt hiểm bỏ cuống rồi đem băm nhuyễn cả tỏi, hành tím và ớt. Hành tây bạn lột bỏ vỏ, 1 nửa cắt lát mỏng, 1 nửa cắt múi cau. Phần hành tây cắt mỏng bạn cho vào dĩa thịt bò, trộn đều.\n\n**Bước 3: Nấu nước dấm nhúng bò**\nChuẩn bị nguyên liệu xong, bạn bắc nồi lên bếp cùng 2 muỗng canh dầu ăn với lửa vừa. Dầu sôi lăn tăn sôi bạn cho phần sả đập dập vào phi thơm. Kế đến, bạn cho phần tỏi, hành tím và ớt hiểm băm nhuyễn vào, tiếp tục dùng đũa xào đều thêm 2 phút. Sau đó, bạn thêm 1.5 lít nước dừa, 100ml giấm, 30gr đường phèn, hành tây cắt múi cau vào, dùng vá đảo đều rồi nấu khoảng 5 phút. Tiếp đó bạn nêm nếm gia vị vừa ăn nữa là nhúng thịt bò vào và thưởng thức thôi!\n\n**Bước 4: Pha nước chấm**\nBạn lấy chén rồi cho phần thơm băm nhuyễn, 4 muỗng canh mắm nêm, 2 muỗng canh đường, dùng muỗng trộn đều để tất cả được hòa lẫn với nhau.\n\n**Bước 5: Thành phẩm**\nLẩu bò nhúng giấm quả là món ăn vừa thơm ngon lại bổ dưỡng mà không thể chê vào đâu được các bạn nhỉ? Chỉ với vài bước đơn giản, thế là bạn đã có thể thưởng thức được từng miếng bò dai mềm nhúng với phần nước mặn mà, chua ngọt dịu nhẹ hấp dẫn vô cùng! Đặc biệt, lẩu bò nhúng dấm (giấm) còn có thể ăn cùng bún tươi, hoặc cuốn với bánh tráng và rau sống nữa đó nha! Chắc chắn phải chấm kèm với chén mắm nêm để món lẩu thêm tròn vị nữa đấy!	25	20	4	Easy	Published	db628456-1e16-4c67-bd2a-6d297d718ef9	7d581264-5002-4f9d-823b-11f89ddbbb9b	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	73
18c4049d-bbdd-5c84-8bb4-8574700a9491	Lẩu cá quả rau cải xanh thơm ngon khó cưỡng, cực đơn giản tại nhà	lau-ca-qua-rau-cai-xanh-thom-ngon-kho-cuong-cuc-don-gian-tai	Chào mừng bạn cùng vào bếp khám phá cách làm lẩu cá quả rau cải cực phẩm! Món lẩu cá quả này không chỉ đậm đà, chua cay mà còn thơm lừng, đảm bảo sẽ làm hài lòng cả gia đình. Cùng mình trổ tài nấu món lẩu hấp dẫn này nhé!	### Hướng dẫn cách nấu: Lẩu cá quả rau cải xanh thơm ngon khó cưỡng, cực đơn giản tại nhà\n\n**Bước 1: Sơ chế xương và ninh nước dùng lẩu**\nĐầu tiên, các bạn cho xương cục vào nồi nước sôi, chần sơ khoảng 1-2 phút để loại bỏ bọt bẩn và máu trong xương. Điều này giúp nước dùng trong và không bị đục. Sau khi chần, rửa sạch xương dưới vòi nước lạnh. Cho xương đã rửa sạch vào nồi khoảng 2-2.5 lít nước. Đặt lên bếp và ninh trong khoảng 30 phút đến 1 tiếng đồng hồ. Lưu ý, ở bước này chúng ta chưa nêm bất kỳ gia vị nào vào nước dùng nhé.\n\n**Bước 2: Sơ chế cá quả và các nguyên liệu khác**\nCá quả sau khi làm sạch, các bạn cắt thành từng khúc dày khoảng 3cm. Rửa lại cá với nước sạch. Sả đập dập và băm nhỏ. Hành khô đập dập, băm nhỏ. Cà chua bổ múi cau. Rau ăn kèm như ngô, rau cải, rau thì là thái nhỏ khoảng 1.5-2cm.\n\n**Bước 3: Chuẩn bị rau ăn kèm và trình bày**\nXếp rau cải, rau thì là đã thái vào đĩa. Sau đó, đặt các khúc cá quả lên trên.\n\n**Bước 4: Phi thơm gia vị cho nước lẩu chua cay**\nCho một chút dầu ăn vào chảo, đun nóng rồi cho hành khô băm vào phi thơm vàng. Khi hành đã thơm, cho sả băm vào phi chung cho đến khi tất cả vàng đều và dậy mùi thơm. Tiếp theo, cho cà chua bổ múi cau và 1 trái ớt vào đảo đều. Cuối cùng, cho 3 thìa canh cơm mẻ vào đảo chung. Nếu cơm mẻ của bạn chưa ngấu, hãy xay nhuyễn trước khi cho vào nhé. Đảo đều cho đến khi mùi mẻ thơm lừng thì tắt bếp.\n\n**Bước 5: Hoàn thiện nước lẩu cá quả đậm đà**\nTrút phần gia vị đã phi thơm ở Bước 4 vào nồi nước xương đang ninh. Nêm nếm gia vị: Thêm 3 muỗng cà phê bột nêm, 1/2 muỗng cà phê muối và 1/2 muỗng cà phê bột ngọt. Khuấy đều và nếm thử. Tùy theo khẩu vị gia đình, bạn có thể điều chỉnh độ mặn, ngọt. Nếu muốn ăn cay, thêm sa tế hoặc tương ớt. Để nước lẩu có màu vàng đẹp mắt, bạn có thể cho thêm 1/2 củ nghệ nhỏ đập dập hoặc 1/2 muỗng cà phê bột nghệ. Nước lẩu cá quả sau khi hoàn thiện sẽ có vị ngọt thanh từ xương, chua dịu của mẻ, thơm lừng mùi hành sả và chút cay nhẹ, rất hấp dẫn.\n\n**Bước 6: Thành phẩm**\nBây giờ, bạn chỉ cần đặt nồi lẩu lên bếp từ hoặc nồi lẩu điện, đun sôi và bắt đầu nhúng cá, rau cùng các nguyên liệu ăn kèm. Khi ăn, nhúng từng miếng cá quả chắc thịt, chấm kèm nước mắm ớt và thưởng thức cùng rau cải hơi đắng nhẹ, ngô ngọt. Món lẩu cá quả rau cải này sẽ làm ấm lòng cả gia đình bạn.	40	75	4	Hard	Published	db628456-1e16-4c67-bd2a-6d297d718ef9	1c7a1ddf-c7eb-4029-8fe4-49f5ea29a8b0	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	152
1901526a-0fcb-5c30-905d-78addcd96622	Lẩu riêu cua bắp bò sườn sụn tại nhà đơn giản	lau-rieu-cua-bap-bo-suon-sun-tai-nha-don-gian	Bạn đang tìm cách làm lẩu riêu cua bắp bò sườn sụn thơm ngon chuẩn vị cho cả nhà? Vào bếp khám phá bí quyết nấu món lẩu riêu cua đậm đà, béo ngậy! Món lẩu này sẽ là lựa chọn tuyệt vời cho những bữa tiệc ấm cúng.	### Hướng dẫn cách nấu: Lẩu riêu cua bắp bò sườn sụn tại nhà đơn giản\n\n**Bước 1: Lọc cua đồng lấy nước cốt riêu cua đậm đà**\nVới 1.5-2kg cua đồng đã xay sẵn, bạn cho vào một bát lớn, đổ nước vào và dùng tay bóp đều để phần thịt cua tách khỏi xương. Để lắng một chút, sau đó nghiêng bát chắt lấy phần nước thịt cua cho vào nồi. Lặp lại quá trình này 2-3 lần cho đến khi phần bã cua trắng, không còn thịt.\n\n**Bước 2: Sơ chế cà chua, hành khô và hành lá**\nCà chua rửa sạch, bổ múi cau, bỏ phần núm. Hành khô bóc vỏ, thái lát mỏng. Hành lá rửa sạch, cắt khúc dài khoảng 2cm. Các nguyên liệu này sẽ giúp món lẩu riêu cua bắp bò sườn sụn của bạn thêm phần hấp dẫn.\n\n**Bước 3: Nấu nước dùng lẩu riêu cua và vớt riêu cua**\nCho phần nước cốt cua đã lọc vào nồi, nêm 1 muỗng cà phê bột ngọt và 1 muỗng cà phê bột canh để nước dùng và riêu cua được đậm vị. Khuấy đều theo một chiều để thịt cua cuộn xoáy vào nhau. Bật bếp ở lửa vừa (ví dụ: mức 5/8 trên bếp từ). Khi nước nóng và gần sôi, thịt cua sẽ bắt đầu nổi lên và đóng thành từng bánh. Lúc này, hạ nhỏ lửa (ví dụ: mức 2/8) để tránh riêu bị bung trào. Khi nước sôi bùng, hạ lửa nhỏ nhất (mức 1/8), đậy nắp nấu thêm 2 phút cho riêu chín. Sau đó, tắt bếp và vớt toàn bộ phần bánh riêu cua ra bát riêng.\n\n**Bước 4: Xào cà chua tạo màu cho nước lẩu**\nĐặt chảo lên bếp, cho 2 muỗng canh mỡ gà vào đun nóng. Khi dầu nóng, cho một nửa số hành khô đã thái lát vào phi thơm vàng. Tiếp đến, trút toàn bộ cà chua vào xào ở lửa lớn khoảng 20 giây cho cà chua thấm dầu. Cuối cùng, cho hành lá vào đảo nhanh rồi tắt bếp. Đổ phần cà chua xào này vào nồi nước dùng lẩu riêu cua.\n\n**Bước 5: Chưng gạch cua và làm nước chấm lẩu riêu cua đặc biệt**\nSử dụng chảo vừa xào cà chua, cho 2 muỗng canh mỡ gà (hoặc dầu ăn) vào. Nếu muốn gạch cua có màu vàng đậm hơn, bạn có thể thêm 2 muỗng canh dầu màu điều. Phi thơm phần hành khô còn lại. Khi hành vàng thơm, hạ lửa nhỏ nhất, cho phần gạch cua vào chưng khoảng hơn 1 phút cho gạch chín và lên màu đẹp mắt. Tắt bếp, chia gạch cua chưng làm hai phần. Một nửa cho vào nồi nước dùng để tạo màu và hương vị. Nửa còn lại sẽ dùng làm nước chấm: nêm thêm chút bột ngọt, nước mắm, sa tế (nếu ăn cay) và 2 muỗng canh nước cua từ nồi lẩu. Bật bếp lửa nhỏ nấu sôi lại, thêm chút hành phi cho dậy mùi rồi tắt bếp, cho ra bát.\n\n**Bước 6: Hoàn thiện nồi lẩu riêu cua bắp bò sườn sụn**\nBật bếp trở lại với nồi nước dùng lẩu riêu cua. Nêm nếm gia vị với bột canh, bột ngọt và đặc biệt là dấm bỗng để tạo vị chua thanh đặc trưng. Với 8 lít nước dùng, bạn có thể dùng khoảng 8 thìa canh dấm bỗng, tùy chỉnh theo khẩu vị. Đợi nước lẩu sôi, chuyển sang nồi lẩu chuyên dụng. Cho đậu phụ, tóp mỡ, hành phi, và một ít gạch cua chưng vào nồi lẩu.\n\n**Bước 7: Thành phẩm**\nGiờ thì bạn đã có một nồi lẩu riêu cua bắp bò sườn sụn thơm lừng, nóng hổi sẵn sàng để thưởng thức! Dọn kèm các loại thịt bò (bắp bò, diềm thăn giòn, sườn sụn non, ba chỉ bò Mỹ), đậu phụ, váng đậu, các loại nấm, rau nhúng và bún tươi. Món lẩu này chắc chắn sẽ làm hài lòng mọi thành viên trong gia đình và bạn bè.	60	45	5	Hard	Published	db628456-1e16-4c67-bd2a-6d297d718ef9	7c46cda2-3fd0-431a-894f-c0b15881fbfb	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	89
e1721eed-2286-5a6b-9dc3-63a6cb98ecc1	Bánh hamburger chay đơn giản, ngon miệng tại nhà!	banh-hamburger-chay-don-gian-ngon-mieng-tai-nha	Tháng 7 này, hãy cùng vào bếp trổ tài làm món hamburger chay thơm ngon, bổ dưỡng cho gia đình nhé! Công thức bánh burger chay này không chỉ dễ làm mà còn là một món chay lành mạnh, đầy đủ dưỡng chất. Đảm bảo ai cũng mê mẩn món bánh này!	### Hướng dẫn cách nấu: Bánh hamburger chay đơn giản, ngon miệng tại nhà!\n\n**Bước 1: Sơ chế và ướp rau ăn kèm**\nRửa 100gr bắp cải tím đã thái nhỏ qua nước muối pha loãng, sau đó rửa lại bằng nước sạch và để ráo. Cho bắp cải vào tô, ướp với 1/4 thìa cà phê muối, 2 thìa cà phê đường và 1/2 thìa canh giấm táo. Trộn đều và để khoảng 10 phút cho bắp cải xèo xuống, sau đó vắt ráo nước. Dưa leo, cà chua rửa sạch, thái lát mỏng. Rau xà lách rửa sạch, để ráo. Đây là những nguyên liệu làm hamburger chay không thể thiếu.\n\n**Bước 2: Làm sốt hamburger chay béo ngậy**\nĐun sôi nồi nước có pha chút muối loãng, cho 100gr đậu hũ non vào luộc khoảng 3 phút rồi vớt ra. Cho đậu hũ non đã luộc vào máy xay. Thêm 2 thìa canh tương ớt, 1/2 thìa cà phê muối, 1/2 thìa canh đường và 1 thìa canh dầu ăn. Xay mịn hỗn hợp cho đến khi sốt sánh, mịn màng. Vậy là bạn đã có phần sốt chay rất béo thơm và giàu dinh dưỡng cho món bánh burger chay.\n\n**Bước 3: Chế biến thịt hamburger chay thơm lừng**\n200gr khoai môn cao gọt vỏ, thái nhỏ. Hấp chín khoai môn trong khoảng 15 phút tính từ lúc nước sôi. Cho khoai môn đã hấp chín vào máy xay. Thêm 100gr cọng tàu hủ ky non, 1 miếng lá sườn chay đã ngâm mềm, 1 đoạn gốc boa rô. Nêm gia vị: 1/2 thìa cà phê muối, 1 thìa canh hạt nêm chay, 1/2 thìa canh đường, 1 thìa cà phê tiêu và 1 thìa canh bột mì đa dụng để tạo độ kết dính cho ham. Xay mịn hỗn hợp cho đến khi dẻo quánh. Sau đó, tạo hình hỗn hợp thành 4 miếng ham tròn, dẹt, có độ dày vừa phải. Đây là cách làm patty chay đơn giản. Làm nóng chảo với 2 thìa canh dầu ăn. Cho từng miếng ham vào chiên với lửa nhỏ cho vàng đều hai mặt, có chút giòn nhẹ bên ngoài.\n\n**Bước 4: Hoàn thành món hamburger chay hấp dẫn**\nChẻ đôi bánh mì hamburger. Phết đều một lượng sốt chay vừa đủ lên mặt trong của nửa bánh trên. Đặt lá xà lách, lát cà chua, dưa leo xen kẽ lên nửa bánh dưới. Tiếp tục phết thêm một ít sốt lên rau củ để tăng hương vị đậm đà. Đặt miếng ham chiên lên trên cùng. Úp nửa bánh mì đã phết sốt lên trên để hoàn thành chiếc hamburger chay.\n\n**Bước 5: Thành phẩm**\nMón hamburger chay thơm ngon, bổ dưỡng đã sẵn sàng để thưởng thức. Với đầy đủ rau củ tươi mát, sốt béo ngậy và ham chiên đậm đà, đây chắc chắn là món ăn chay đốn tim cả người lớn lẫn trẻ nhỏ.	20	45	4	Hard	Published	72414fc7-6908-4dfe-a469-e692d8ea2c42	078bf482-fe40-4efb-9281-4ae88d007f46	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	260
dacd5de8-f548-5e96-9b09-bee5320ee3e8	Cá kèo chay từ đậu phụ và rong biển giòn ngon đơn giản tại nhà	ca-keo-chay-tu-dau-phu-va-rong-bien-gion-ngon-don-gian-tai-n	Bạn đang tìm món cá kèo chay dai ngon cho bữa cơm gia đình? Hãy cùng Vào bếp thực hiện món chay cực đơn giản từ sườn non chay và rong biển, thành phẩm giòn ngon thơm lừng khiến ai cũng phải trầm trồ nhé!	### Hướng dẫn cách nấu: Cá kèo chay từ đậu phụ và rong biển giòn ngon đơn giản tại nhà\n\n**Bước 1: Sơ chế sườn non chay và nấm**\nNgâm sườn non chay khô với 1 lít nước cho nở mềm, sau đó rửa sạch và vắt thật ráo nước. Nấm kim châm rửa qua nước muối loãng, cho vào túi nilon dùng chày giã tơi (không giã nhuyễn) để tạo sớ thịt dai ngon cho món ăn. Sườn non cũng mang đi giã nhuyễn bằng tay để giữ được kết cấu sớ thịt tự nhiên.\n\n**Bước 2: Luộc và quết đậu hũ**\nCho đậu hũ trắng vào nồi luộc với 1 muỗng cà phê muối trong 10 đến 15 phút đến khi đậu nổi lên và xuất hiện các lỗ li ti bên trong. Vớt ra để thật nguội, cho vào túi vải vắt kiệt nước rồi dùng chày giã liên tục đến khi đậu hũ dẻo mịn, có độ kết dính cao và hít chặt vào chày.\n\n**Bước 3: Trộn nhân và tạo hình cá kèo chay**\nCho sườn non và nấm đã vắt khô vào thau đậu hũ, nêm 1,5 muỗng cà phê hạt nêm chay và 1 muỗng cà phê tiêu xay. Dùng tay nhồi kỹ đến khi hỗn hợp thành một khối dẻo đồng nhất. Lấy một lượng nhân vừa đủ, bóp chặt tay rồi nặn thành hình trụ dài giống như hình dáng con cá kèo.\n\n**Bước 4: Cuốn lớp da cá bằng rong biển khô**\nHòa tan bột mì với nước để tạo hỗn hợp keo sệt. Cắt rong biển thành các miếng có chiều dài vừa vặn với con cá đã nặn. Phết một lớp bột mì mỏng lên rong biển, đặt nhân vào giữa rồi cuộn chặt lại. Bột mì sẽ giúp lớp rong biển dính chặt vào nhân, không bị bong khi chế biến các món kho chay hay món chiên.\n\n**Bước 5: Hấp và định hình**\nLót giấy nến vào xửng hấp, xếp cá vào và phủ thêm một lớp giấy nến lên trên để tránh nước nhỏ xuống làm nát rong biển. Hấp cá trong 30 phút ở lửa nhỏ, sau đó để nguội hẳn rồi bọc màng bọc thực phẩm, cho vào ngăn mát tủ lạnh qua đêm để cá định hình chắc chắn và dai ngon hơn.\n\n**Bước 6: Chiên cá kèo chay**\nCá kèo chay sau 1 đêm đã dẻo dai, bạn khía nhẹ những đường chéo trên thân cá rồi cho vào chảo dầu nóng, chiên đến khi giòn vàng đều và tỏa mùi thơm hấp dẫn.\n\n**Bước 7: Thành phẩm**\nCá kèo chay sau khi chiên có lớp vỏ rong biển giòn rụm, bên trong nhân dai chắc, đậm đà. Khi ăn, bạn có thể làm món kho chay, hoặc đơn giản cuốn cá với bánh tráng và rau, chấm cùng nước mắm me chua cay cũng rất ngon.	40	60	4	Hard	Published	72414fc7-6908-4dfe-a469-e692d8ea2c42	573f12df-dbdb-40b0-82f9-bd52ca5c972c	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	95
86312047-fba9-5e2c-a441-f693b2622cce	Tempura rau củ giòn rụm thơm ngon chuẩn vị Nhật Bản tại nhà cực dễ	tempura-rau-cu-gion-rum-thom-ngon-chuan-vi-nhat-ban-tai-nha-	Tempura là một trong những món ăn biểu tượng của Nhật Bản với lớp vỏ mỏng tang, giòn rụm bao bọc lấy phần rau củ tươi ngọt. Hôm nay, Điện máy XANH sẽ cùng bạn vào bếp để khám phá bí quyết thực hiện món chiên đặc sắc này.	### Hướng dẫn cách nấu: Tempura rau củ giòn rụm thơm ngon chuẩn vị Nhật Bản tại nhà cực dễ\n\n**Bước 1: Làm nước chấm (Tentsuyu)**\nBạn cho 180ml nước dùng dashi, 3 muỗng canh nước tương, 2 muỗng canh rượu mirin và 2 muỗng cà phê đường vào một chiếc nồi nhỏ. Bạn bật bếp đun sôi, sau đó hạ lửa và đun liu riu cho đến khi đường tan hết rồi tắt bếp, để sang một bên.\n\n**Bước 2: Sơ chế rau củ**\nBạn cắt 1 củ khoai lang thành các lát tròn dày khoảng 6mm, ngâm trong nước 15-30 phút để loại bỏ tinh bột thừa rồi thấm thật khô. Bạn cắt bí đỏ và 5cm ngó sen thành lát dày 6mm (ngâm ngó sen vào chén nước có pha 1 muỗng cà phê giấm trong 5 phút rồi thấm khô). Nấm đùi gà bạn cắt lát mỏng dọc theo thân. Riêng cà tím, ngay trước khi chiên bạn mới cắt đôi theo chiều dọc, khía các đường mỏng khoảng 3mm dọc theo thân (giữ lại phần cuống khoảng 2.5cm) rồi ấn nhẹ để tạo hình rẻ quạt. Lá tía tô bạn rửa sạch và để nguyên lá.\n\n**Bước 3: Pha bột tempura**\nBạn rây 120gr bột mì vào tô lớn. Trong một tô khác, bạn khuấy mạnh 200ml nước đá lạnh với 1 quả trứng gà rồi hớt bỏ bọt trên bề mặt. Bạn đổ từ từ hỗn hợp trứng nước vào tô bột, dùng đũa khuấy theo hình số 8 trong khoảng 15 - 20 giây. Bạn lưu ý không khuấy quá kỹ, bột vẫn còn những cục vón nhỏ là đạt. Để bột luôn lạnh, bạn có thể thêm 1 - 2 viên đá hoặc đặt tô bột vào một thau nước đá lớn hơn.\n\n**Bước 4: Chiên rau củ**\nBạn cho khoảng 1 lít dầu ăn vào nồi hoặc chảo sâu lòng sao cho dầu cao khoảng 3cm, làm nóng dầu đến 160°C. Để kiểm tra, bạn nhúng đầu đũa gỗ vào, nếu thấy bọt nhỏ li ti sủi quanh đầu đũa là dầu đã đạt yêu cầu. Khi dầu đạt 160°C, bạn nhúng khoai lang và ngó sen vào bột rồi chiên trong 3 - 4 phút đến khi vàng nhạt. Tiếp theo, bạn tăng lửa để nhiệt độ dầu lên khoảng 170 - 180°C, nhúng bí đỏ, cà tím và nấm vào bột rồi chiên trong 1 - 2 phút. Cuối cùng, bạn phủ một ít bột mì khô lên mặt sau lá tía tô, chỉ nhúng mặt sau này vào bột tempura rồi chiên nhanh trong 15-20 giây. Bạn vớt tempura ra khay có giá đỡ hoặc giấy thấm dầu để loại bỏ dầu thừa.\n\n**Bước 5: Thành phẩm**\nMón tempura rau củ có lớp vỏ vàng nhạt, giòn tan bao bọc bên ngoài phần rau củ chín mềm, ngọt lịm. Bạn phục vụ món ăn kèm với nước chấm Tentsuyu ấm nóng nhé. Món này giúp bạn thưởng thức rau củ chiên mãi mà không thấy ngán.	25	45	2	Hard	Published	72414fc7-6908-4dfe-a469-e692d8ea2c42	456e6fad-7dc8-4695-8063-23bf6e2c73f3	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	101
25e20399-9bef-56eb-b205-d37f28eb4553	2 cách làm đậu hũ sốt cà chua chay đơn giản dễ làm cho bữa cơm thanh đạm	2-cach-lam-dau-hu-sot-ca-chua-chay-don-gian-de-lam-cho-bua-c	Đậu hũ là một trong những loại thực phẩm phổ biến cho bữa cơm chay ở nhiều gia đình. Hôm nay Điện máy XANH sẽ giúp bạn bỏ túi thêm cách làm đậu hũ sốt cà chua chay thơm béo hấp dẫn mà lại cực kỳ đơn giản. Cùng vào bếp với món xào này ngay nhé!	### Hướng dẫn cách nấu: 2 cách làm đậu hũ sốt cà chua chay đơn giản dễ làm cho bữa cơm thanh đạm\n\n**Bước 1: Sơ chế nguyên liệu**\nMua đậu hũ chiên sẵn về cắt thành khối hình vuông nhỏ vừa ăn. Cà chua rửa sạch, bỏ cuống rồi cắt hình múi cau.\n\n**Bước 2: Làm đậu hũ sốt cà chua**\nBắc chảo lên bếp với 2 muỗng canh dầu ăn đun với lửa lớn. Khi dầu nóng thì cho cà chua vào xào khoảng 5 phút để mềm và tan thành hỗn hợp sền sệt. Sau đó bạn hạ bếp xuống còn lửa nhỏ rồi cho đậu hũ chiên vào đảo đều. Nêm vào 1 muỗng cà phê muối, 1/2 muỗng cà phê bột ngọt, 2 muỗng cà phê hạt nêm chay, đảo đều khoảng 3 phút cho gia vị thấm vào đậu hũ. Nêm nếm gia vị lại cho vừa ăn rồi tắt bếp. Cho đậu hũ sốt cà chua ra dĩa là hoàn thành rồi.\n\n**Bước 3: Thành phẩm**\nMón đậu hũ sốt cà chua chay bắt mắt vô cùng với màu vàng nhẹ của đậu hũ và màu đỏ tươi quyến rũ của cà chua. Miếng đậu hũ mềm mịn béo thơm hòa cùng vị chua dịu nhẹ của cà chua chắc chắn sẽ hao cơm lắm đấy!\n\n**Bước 4: Sơ chế nguyên liệu**\nĐậu hũ ta sau khi mua về, ban rửa sạch rồi đem đi luộc chín. Sau đó, bạn lấy đậu hũ ra và xắt lát vừa ăn rồi xếp ra dĩa. Nấm đùi gà nhỏ thì cắt bỏ phần chân nấm, ngâm trong nước muối loãng khoảng 3 - 5 phút, rửa lại với nước và để ráo. Cắt lát vừa ăn. Cà chua rửa sạch, cắt hạt lựu.\n\n**Bước 5: Xào nấm**\nBắc chảo lên bếp, cho 1 muỗng canh dầu ăn vào chảo, đợi dầu nóng cho 1 muỗng canh hành Boaro vào phi thơm, sau đó cho nấm đùi gà xào. Nêm thêm 1/2 muỗng cà phê hạt nêm chay, 1 muỗng cà phê dầu hào chay, 2 muỗng canh nước, 1 muỗng cà phê nước tương và 1/3 muỗng cà phê bột bắp pha loãng với 1/3 chén nước. Bạn đảo đều tay đến khi nấm thấm đều gia vị thì thêm 1 ít lát ớt.\n\n**Bước 6: Làm sốt cà chua**\nBạn đặt chảo khác lên bếp, phi thơm 1 muỗng canh dầu ăn với 1/2 chén hành lá và cà chua cắt nhỏ. Sau đó, bạn cho lần lượt: 2/3 muỗng canh hạt nêm chay, 2/3 muỗng canh đường, 1 muỗng canh nước mắm chay, 2 muỗng tương cà, 1 muỗng canh bột bắp pha loãng với 50 ml nước vào chảo. Bạn đảo đều và mở lửa lớn để đun sôi hỗn hợp. Khi hỗn hợp sôi, giảm lửa nhỏ lại và đun đến khi nước sốt có độ sệt mong muốn là được.\n\n**Bước 7: Hoàn thành**\nBạn cho đậu hũ ta đã luộc ra dĩa, sau đó cho nấm xào lên rồi rưới thêm sốt cà cà lên trên, thêm 1 ít hành lá và ngò được cắt nhỏ lên trên để trang trí là hoàn thành.\n\n**Bước 8: Thành phẩm**\nĐậu hũ sốt cà chua có màu sắc bắt mắt, hấp dẫn. Đậu hũ ta mềm mịn, beo béo kết hợp với dai mềm sần sật của nấm đùi gà, hoà quyện với nước sốt cà chua đậm đà, ăn cực bắt miệng.	20	20	2	Easy	Published	72414fc7-6908-4dfe-a469-e692d8ea2c42	98ec81e8-21ab-41be-a3f2-cdf05dfcc8b5	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	134
dd6da83f-f56b-5b05-9907-30a6eccf87da	Chè tàu hủ mềm mịn không thạch cao cực dễ tại nhà	che-tau-hu-mem-min-khong-thach-cao-cuc-de-tai-nha	Chè tàu hủ là món tráng miệng giải nhiệt mùa hè tuyệt vời cho gia đình. Cùng vào bếp học cách làm chè tàu hủ trắng ngần, sánh mịn từ đậu nành nguyên chất mà không cần thạch cao phi. Món chè thơm lừng mùi lá dứa này hứa hẹn sẽ khiến bạn hài lòng.	### Hướng dẫn cách nấu: Chè tàu hủ mềm mịn không thạch cao cực dễ tại nhà\n\n**Bước 1: Sơ chế đậu nành và làm trân châu trắng**\nĐậu nành sau khi mua về bạn rửa sạch rồi ngâm qua đêm từ 6 đến 8 tiếng cho hạt nở mềm. Trong lúc đợi, bạn làm trân châu bằng cách cho nước ấm khoảng 70 đến 80 độ C vào 40 gr bột năng, nhồi đều rồi vò viên nhỏ. Luộc trân châu trong nước sôi đến khi trong veo thì vớt ra để ráo.\n\n**Bước 2: Xay đậu nành và lọc sữa**\nĐậu nành đã ngâm đem đãi sạch vỏ để thành phẩm tào phớ trắng đẹp hơn. Cho đậu vào máy xay cùng khoảng 1 lít nước. Sử dụng túi vải lọc lấy nước cốt đậu nành, nên lọc 1 đến 2 lần để đảm bảo nước đậu thật mịn, không còn bã, giúp tàu hủ mịn màng hơn.\n\n**Bước 3: Nấu sữa đậu nành và pha bột gạo**\nCho nước đậu nành vào nồi cùng vài lá dứa để tạo mùi thơm, đun sôi và thường xuyên hớt bọt. Sau 5 phút, vớt lá dứa ra để tránh bị đắng. Pha 3 muỗng canh bột gạo với 3 muỗng canh nước, khuấy tan rồi đổ từ từ vào nồi sữa đậu. Tiếp tục nấu thêm khoảng 20 phút trên lửa nhỏ, vừa nấu vừa khuấy đều tay để không bị dính đáy nồi.\n\n**Bước 4: Cách làm chè tàu hủ bằng đường nho**\nPha khoảng 1/6 muỗng cà phê đường nho với một chút nước vào thố, tráng đều đáy và thành thố. Lưu ý chỉ pha đường nho khi sữa đậu đã nấu xong và để nguội bớt xuống khoảng 80 độ C. Đổ dứt khoát nước sữa đậu nành vào thố đường nho, hớt bỏ bọt trên bề mặt. Đậy một chiếc khăn sạch lên miệng thố rồi mới đậy nắp để tránh nước đọng nhỏ xuống làm rỗ mặt. Để yên 40 phút cho đậu đông lại.\n\n**Bước 5: Nấu nước đường gừng**\nCho 150 gr đường thốt nốt vào nồi cùng một ít nước, nấu đến khi đường tan và chuyển màu vàng đẹp. Thêm gừng thái sợi và phần trân châu đã luộc chín vào nấu cùng cho đến khi nước đường hơi sánh lại thì tắt bếp.\n\n**Bước 6: Thành phẩm**\nMón chè tàu hủ sau khi hoàn thành có màu trắng ngần, kết cấu mềm dẻo, sánh mịn nhờ sự kết hợp của bột gạo và đường nho. Khi ăn, bạn múc từng lát tàu hủ mỏng vào chén, thêm nước đường gừng cay nồng và trân châu dai giòn, có thể thêm chút nước cốt dừa để tăng độ béo ngậy.	20	60	3	Hard	Published	01e55497-eb5a-4c0e-b01a-93b32aa00a9d	a343771d-bafb-4a55-9459-2739d0b00a20	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	283
44719da2-3815-5f03-9ea6-9b4b6597fdd0	Chè xoa xoa hạt lựu Đà Nẵng dai giòn mát lạnh giải nhiệt cực đã	che-xoa-xoa-hat-luu-da-nang-dai-gion-mat-lanh-giai-nhiet-cuc	Chè xoa xoa hạt lựu là món quà vặt trứ danh của Đà Nẵng, ghi điểm bởi sự mộc mạc nhưng lại vô cùng gây thương nhớ. Hãy cùng Vào bếp thực hiện ngay món chè giải nhiệt cực đã này cho cả gia đình vào những ngày hè oi ả nhé!	### Hướng dẫn cách nấu: Chè xoa xoa hạt lựu Đà Nẵng dai giòn mát lạnh giải nhiệt cực đã\n\n**Bước 1: Làm hạt lựu từ bột năng**\nTrộn 300 gr bột năng với 250 ml nước, lọc qua hộp có lót giấy và vải mùng để rút bớt nước trong 30 phút. Xay củ dền lấy nước cốt rồi đổ lên bề mặt bột đã khô, phủ thêm một lớp bột năng khô để chống dính. Cắt bột thành từng miếng nhỏ hình hạt lựu, sau đó sàng bỏ bột thừa.\n\n**Bước 2: Luộc hạt lựu**\nĐun sôi nước, thả hạt lựu vào luộc khoảng 5 phút cho đến khi hạt nổi lên và trong suốt. Vớt ra ngâm ngay vào nước lạnh, rửa sạch 2-3 lần rồi trộn với 3 muỗng canh đường để hạt bóng và giòn.\n\n**Bước 3: Nấu sương sâm**\nBạn vò 100 gr lá sâm cùng 1 lít nước lọc. Sau khi vò nát lá sâm, bạn lọc qua rây để loại bỏ vụn lá. Sau đó để hỗn hợp sương sâm đông trong 1-2 tiếng.\n\n**Bước 4: Nấu sương sáo**\nĐối với sương sáo, bạn trộn 50 gr bột sương sáo với 100 gr đường cát, sau đó thêm 1 lít nước và khuấy đều. Vừa đun vừa khuấy hỗn hợp ở lửa nhỏ đến khi thấy hỗn hợp đặc và đen bóng, cho sương sáo ra khay và để vào tủ lạnh cho sương sáo đông trong 2 tiếng.\n\n**Bước 5: Nấu xoa xoa**\nĐể nấu xoa xoa, bạn có thể dùng 25 gr bột rau câu giòn, nấu cùng 1 lít nước lọc nếu bạn không tìm được rong biển khô để nấu xoa xoa.\n\n**Bước 6: Hấp chín đậu xanh**\nĐậu xanh sau khi ngâm trong 2 tiếng cho nở, bạn đem hấp chín với một chút muối. Nếu thích ăn đậu xanh mịn, bạn có thể cho đậu xanh hấp chín vào máy xay nhuyễn.\n\n**Bước 7: Thành phẩm**\nCho sương sáo, sương sa, lá sâm, hạt lựu và đậu xanh vào tô. Thêm nước cốt dừa béo ngậy cùng đá bào là bạn đã có món chè xoa xoa hạt lựu mát lạnh, chuẩn vị cho ngày hè oi ả rồi.	45	60	4	Easy	Published	01e55497-eb5a-4c0e-b01a-93b32aa00a9d	852cc4dc-913d-4d95-8962-4c5407d77d3c	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	111
4671a59b-6982-50c5-9aa6-7785ba32450c	Bánh trôi nước (chè trôi nước) dẻo ngon không bị cứng cực đơn giản	banh-troi-nuoc-che-troi-nuoc-deo-ngon-khong-bi-cung-cuc-don-	Bạn đang tìm cách làm bánh trôi nước dẻo thơm cho ngày Tết Hàn Thực? Chuyên mục Vào bếp hôm nay sẽ hướng dẫn bánh trôi nước với bí quyết lấy trùng bột nếp tinh khiết, giúp món chè trôi nước luôn mềm mại, béo ngậy vị nước cốt dừa.	### Hướng dẫn cách nấu: Bánh trôi nước (chè trôi nước) dẻo ngon không bị cứng cực đơn giản\n\n**Bước 1: Nhồi bột (Lấy trùng bột)**\nBạn cho 1 muỗng canh bột nếp (khoảng 10gr) vào nồi cùng 350ml nước, khuấy đều rồi nấu ở lửa vừa cho đến khi hỗn hợp bột sôi và trong lại. Sau đó, bạn rưới từ từ phần nước bột nóng này vào 400gr bột nếp trong tô, dùng cây trộn đều cho bớt nóng rồi dùng tay nhồi kỹ thành khối bột mịn, dẻo. Bạn đậy kín bột và để bột nghỉ trong khoảng 30 phút.\n\n**Bước 2: Làm nhân đậu xanh**\nBạn cho 100gr đậu xanh đã ngâm nở, 100ml nước và 2gr muối vào nồi nấu ở lửa vừa. Khi nước sôi, bạn hớt sạch bọt rồi đậy hờ nắp, nấu nhỏ lửa đến khi cạn nước và đậu chín mềm. Tiếp theo, bạn cho 50gr nước cốt dừa nhất vào sên cùng đậu xanh, khuấy đều tay đến khi đậu dẻo mịn thành một khối không dính nồi thì tắt bếp. Sau đó, bạn chia nhân và vo thành 20 viên tròn nhỏ bằng nhau.\n\n**Bước 3: Nấu nước đường gừng**\nBạn cho 1.5 lít nước vào nồi cùng 350gr đường thốt nốt và 30gr gừng cắt sợi (gừng nên rửa qua nước để khi nấu nước đường không bị đục). Bạn đun sôi cho đường tan hoàn toàn, nước gừng tỏa mùi thơm nồng đặc trưng.\n\n**Bước 4: Nặn và nấu viên bột bánh trôi**\nLấy một lượng bột nếp gấp khoảng 3 lần viên nhân, vo tròn rồi ấn dẹt, cho viên nhân vào giữa rồi gói kín lại. Chuẩn bị một nồi nước sôi khác có pha 15gr đường cát, cho viên bánh vào rửa sơ cho se mặt bột rồi vớt ngay ra cho vào nồi nước đường đang sôi. Bạn nấu bánh trong nước đường ở lửa vừa khoảng 15 phút để bánh chín đều, thấm vị ngọt và đạt độ dẻo mịn hoàn hảo.\n\n**Bước 5: Nấu nước cốt dừa ăn kèm**\nCho 450gr nước cốt dừa, 15gr đường, 15gr bột năng, 10gr bột gạo và 2gr muối vào nồi, khuấy cho tan bột trước khi bật bếp. Nấu ở lửa vừa, khuấy đều tay đến khi nước cốt sôi và sánh đặc lại thì tắt bếp.\n\n**Bước 6: Thành phẩm**\nMón bánh trôi nước hay còn gọi là bánh chay hoàn thành có màu vàng cánh gián đẹp mắt, nước đường trong và thơm mùi gừng. Viên bánh dẻo quện, nhân đậu xanh béo bùi rất vừa miệng. Khi ăn, bạn múc bánh ra chén, rưới thêm nước cốt dừa béo ngậy và rắc đậu phộng, mè rang lên trên để thưởng thức.	40	30	4	Hard	Published	01e55497-eb5a-4c0e-b01a-93b32aa00a9d	cc06a093-474f-4659-9db0-ed4c708e2978	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	263
5e6d38a2-9e40-5c69-a68a-fd755fa3199d	Chè khúc bạch bằng whipping cream béo ngậy, cực dễ làm tại nhà	che-khuc-bach-bang-whipping-cream-beo-ngay-cuc-de-lam-tai-nh	Bạn đang tìm cách làm chè khúc bạch bằng whipping cream mềm tan, béo ngậy? Đừng lo, chuyên mục Vào bếp hôm nay sẽ chia sẻ công thức chè khúc bạch bằng whipping cream chuẩn vị, bảo quản lâu mà không chảy nước. Cùng khám phá bí quyết làm món chè hấp dẫn này nhé!	### Hướng dẫn cách nấu: Chè khúc bạch bằng whipping cream béo ngậy, cực dễ làm tại nhà\n\n**Bước 1: Rang hạnh nhân**\nCho 100gr hạnh nhân lát vào chảo, rang trên lửa nhỏ. Đảo đều tay đến khi hạnh nhân vàng đều và dậy mùi thơm thì tắt bếp ngay.\n\n**Bước 2: Nấu nước đường**\nCho 1 lít nước và 1 bó lá dứa tươi đã rửa sạch vào nồi. Đun sôi. Khi nước đã sôi, cho 200gr đường phèn vào. Nấu thêm khoảng gần 10 phút cho đường tan hoàn toàn thì tắt bếp và vớt lá dứa. Để nước đường nguội hoàn toàn.\n\n**Bước 3: Ngâm gelatin**\nNgâm 40gr gelatin lá trong nước đá khoảng 5 phút cho mềm.\n\n**Bước 4: Nấu hỗn hợp whipping cream**\nBạn cho 1 lít sữa tươi và 200gr đường và 40 gr gelatin đã ngâm mềm ra vào nồi. Đun với lửa nhỏ, vừa đun vừa khuấy nhẹ cho đường tan. Khi sữa bắt đầu bốc khói nhẹ thì bạn tắt bếp. Tuyệt đối không để sôi bùng làm mất độ béo. Sau cùng, đổ 250ml whipping cream vào hòa quyện.\n\n**Bước 5: Nấu rau cau dẻo**\nTrộn 1 muỗng cà phê bột rau câu dẻo với 1 muỗng canh đường. Sau đó, từ từ rót 250ml nước lọc vào, khuấy đều và đun sôi trong 5 phút. Cuối cùng, đổ hỗn hợp rau câu này vào nồi sữa whipping cream ở bước 5 và khuấy đều tay.\n\n**Bước 6: Chuẩn bị màu**\nĐầu tiên, bạn hòa tan 2 muỗng cà phê bột trà xanh với chút nước ở chén nhỏ cho tan mịn để riêng làm màu xanh. Tiếp theo, vắt lấy nước cốt thanh long đỏ để riêng làm màu hồng.\n\n**Bước 7: Tạo màu và hương vị tự nhiên**\nChia hỗn hợp sữa gelatin whipping cream vừa nấu xong ra làm 3 phần: Phần 1 (Màu trắng): Bạn để nguyên trong nồi, thêm 2 ống vani (hoặc hương hạnh nhân) khuấy đều cho thơm. Phần 2 (Màu xanh): Rót sữa ra tô, cho hỗn hợp trà xanh đã khuấy vào hòa quyện. Phần 3 (Màu hồng): Rót sữa ra tô còn lại, cho nước cốt thanh long và 2 ống vani vào khuấy đều đến khi đạt màu hồng ưng ý.\n\n**Bước 8: Đổ khuôn và làm đông thạch**\nRót thạch vào các khuôn nhựa hoặc hộp giấy đã chuẩn bị sẵn. Bạn nên đổ nhẹ tay để bề mặt thạch phẳng đẹp. Để thạch nguội hẳn bên ngoài rồi mới đặt vào ngăn mát tủ lạnh từ 3 – 6 tiếng.\n\n**Bước 9: Thành phẩm**\nKhi thạch đã đông và núng nính đẹp mắt, bạn lấy ra cắt thành từng miếng vuông vừa ăn. Cho thạch vào bát, thêm nước đường lá dứa thơm mát, một ít nước vải, đá viên và cuối cùng là rắc hạnh nhân rang giòn lên trên. Miếng khúc bạch làm từ gelatin kết hợp rau câu có độ mềm mại tuyệt vời, vừa chạm vào đầu lưỡi đã tan ra, để lại vị béo ngậy của sữa và whipping cream.	20	30	4	Hard	Published	01e55497-eb5a-4c0e-b01a-93b32aa00a9d	e95303ad-ac74-4ab2-88e7-e989ae0f17a4	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	270
547555be-a016-527b-847c-c090af4091ac	Trà măng cụt chanh dây uống là ghiền bằng bình siêu tốc hiện đại	tra-mang-cut-chanh-day-uong-la-ghien-bang-binh-sieu-toc-hien	Hè đến, còn gì tuyệt vời hơn khi được thưởng thức một ly trà măng cụt chanh dây thơm lừng, chua ngọt và cực kỳ giải nhiệt? Hôm nay, hãy cùng vào bếp khám phá cách làm trà măng cụt chanh dây đơn giản tại nhà. Bài viết này sẽ hướng dẫn chi tiết từ A-Z để bạn có ngay thức uống hot trend này, đảm bảo ai	### Hướng dẫn cách nấu: Trà măng cụt chanh dây uống là ghiền bằng bình siêu tốc hiện đại\n\n**Bước 1: Sơ chế nguyên liệu**\nMăng cụt tươi sau khi tách vỏ, lấy được khoảng 500gr thịt quả thì đem ngâm vào nước muối loãng để giữ độ tươi và tránh thâm màu. Chanh dây cắt đôi, lấy phần ruột thì thu được khoảng 100gr cốt chanh dây. Cho cốt chanh dây vào tô, thêm vào 100gr đường vàng và 2gr muối, sau đó trộn đều để đường tan và hỗn hợp ngấm vị. Chia măng cụt thành hai phần, 200gr đem dằm nhuyễn, 300gr giữ nguyên tép. Trộn cả hai phần măng cụt với hỗn hợp chanh dây đã ngâm đường, đảo đều rồi để hỗn hợp nghỉ ở nhiệt độ phòng trong khoảng 4 tiếng để măng cụt thấm vị chua ngọt tự nhiên.\n\n**Bước 2: Pha trà hoa nhài**\nỦ 5gr trà xanh hoa nhài với 150ml nước sôi ở 80°C trong khoảng 5 phút. Sau đó lọc bỏ xác trà, giữ lại phần nước cốt để dùng pha.\n\n**Bước 3: Pha trà măng cụt chanh dây**\nCho 50gr thịt măng cụt vào bình lắc và dằm nhuyễn. Tiếp tục cho vào bình 10ml đường, 20ml nước cốt chanh dây, 30ml sirô măng cụt và 150ml nước trà hoa nhài đã pha. Thêm đá viên vừa đủ, sau đó đậy nắp và lắc đều.\n\n**Bước 4: Thành phẩm**\nBạn sẽ có một ly trà măng cụt chanh dây dung tích 700ml với hương vị hài hòa giữa vị chua nhẹ của chanh dây, vị ngọt thanh từ măng cụt và mùi trà hoa nhài thoang thoảng. Thức uống không chỉ mát lạnh sảng khoái mà còn mang đến cảm giác thư giãn, dễ chịu ngay từ ngụm đầu tiên.	20	240	1	Easy	Published	49ccbba7-0b44-4376-899a-c0689813056a	ca9773bc-2065-432d-bde5-43001b2e1415	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	298
635a5b95-7912-5833-8f01-376166ad87d2	Nước dâu tằm thơm ngon không bị lên men để giải khát ngày hè	nuoc-dau-tam-thom-ngon-khong-bi-len-men-de-giai-khat-ngay-he	Mùa dâu đến rồi, nước dâu tằm chính là món giải khát tuyệt vời chứa nhiều vitamin C và dưỡng chất. Hôm nay, hãy cùng Điện máy XANH vào bếp thực hiện thức uống hấp dẫn này. Với bí quyết riêng, bạn sẽ có ngay ly nước dâu tằm đậm vị, màu sắc bắt mắt mà không lo bị lên men thành rượu hay nhanh hỏng.	### Hướng dẫn cách nấu: Nước dâu tằm thơm ngon không bị lên men để giải khát ngày hè\n\n**Bước 1: Sơ chế dâu tằm tươi**\nĐầu tiên, bạn nhặt bỏ hết phần lá, cuống dâu và loại bỏ những quả bị hỏng. Sau đó, bạn mang dâu đi rửa sạch với nước từ 3 tới 4 lần hoặc rửa đến khi thấy nước trong là được. Khi rửa, bạn lưu ý phải thật nhẹ tay vì những quả dâu chín rất dễ bị dập nát. Cuối cùng, bạn vớt dâu ra và để thật ráo nước.\n\n**Bước 2: Ngâm dâu với đường và muối**\nKhi dâu đã ráo nước hoàn toàn, bạn mang dâu đi ướp cùng với 1.4kg đường cát và 8g muối. Bạn đảo đều và để dâu nghỉ trong khoảng từ 3 - 5 tiếng cho đến khi đường tan hết, dâu ngấm đường và tiết ra nước siro dâu tằm.\n\n**Bước 3: Nấu nước cốt dâu tằm thơm lừng**\nBạn chắt lấy phần nước siro dâu cho vào nồi và đun sôi trên bếp. Trong lúc đun, bạn cần hớt sạch bọt để nước dâu được trong và đẹp hơn. Sau khi nước siro sôi, bạn mới cho phần quả dâu vào và đun tiếp trong khoảng 5 phút. Sau khi nấu xong, bạn nhấc nồi ra đợi cho hỗn hợp dâu nguội hẳn. Sau đó, bạn chia nước cốt và quả dâu vào từng hũ thủy tinh sạch, đậy kín nắp và bảo quản trong ngăn mát tủ lạnh để dùng dần.\n\n**Bước 4: Pha chế nước dâu tằm giải khát**\nĐể pha một ly nước 500ml, bạn cho các nguyên liệu vào bình gồm: 100ml nước cốt dâu tằm đã nấu, 150ml nước lọc, 1 muỗng quả dâu tằm, 1 quả tắc vắt lấy cốt (hoặc 10ml nước chanh vàng) và 150gr đá viên. Bạn đậy nắp bình và lắc thật đều tay. Nếu không có bình lắc hoặc pha cho nhiều người, bạn có thể pha tất cả vào một âu lớn rồi rót ra từng ly có sẵn đá. Để tăng thêm sự hấp dẫn, bạn có thể thêm topping là hạt đác rim dâu tằm lên trên.\n\n**Bước 5: Thành phẩm**\nNước dâu tằm sau khi hoàn thành có màu đỏ tím cực kỳ bắt mắt. Khi uống, bạn sẽ cảm nhận được vị chua chua ngọt ngọt thanh mát, hòa quyện cùng hương thơm đặc trưng của dâu chín, rất phù hợp để giải nhiệt trong những ngày nắng nóng.	60	15	4	Hard	Published	49ccbba7-0b44-4376-899a-c0689813056a	7d581264-5002-4f9d-823b-11f89ddbbb9b	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	74
4f40fcf1-a515-522d-848b-1535f445e73d	Rau má đậu xanh sữa dừa (công thức kinh doanh) thơm béo giải nhiệt	rau-ma-dau-xanh-sua-dua-cong-thuc-kinh-doanh-thom-beo-giai-n	Rau má đậu xanh sữa dừa là thức uống giải nhiệt lý tưởng cho những ngày nắng nóng. Cùng chuyên mục Vào bếp thực hiện ngay món thức uống thanh lọc cơ thể này với cách làm rau má sữa dừa siêu đơn giản. Đảm bảo ly nước béo ngậy sẽ khiến cả nhà thích mê!	### Hướng dẫn cách nấu: Rau má đậu xanh sữa dừa (công thức kinh doanh) thơm béo giải nhiệt\n\n**Bước 1: Sơ chế và hấp đậu xanh cà vỏ**\nBạn đem 200gr đậu xanh cà vỏ ngâm với nước sôi trong khoảng 1 tiếng để hạt đậu nở đều. Sau đó, bạn rửa sạch lại đậu rồi cho vào xửng hấp. Bạn dàn đều đậu ra xửng và hấp trong vòng 20 phút ở lửa vừa cho đến khi hạt đậu chín mềm, khi bóp thấy hạt đậu nát mịn là được.\n\n**Bước 2: Làm phần đậu xanh sữa dừa**\nBạn chuẩn bị một chiếc ca, cho vào 300ml nước thật sôi, 250gr sữa đặc và 80gr bột cốt dừa, sau đó khuấy đều cho hỗn hợp hòa quyện. Tiếp theo, bạn cho phần đậu xanh đã hấp chín vào máy xay cùng với hỗn hợp sữa dừa vừa pha và 1/2 muỗng cà phê muối. Sau khi xay lần 1 khoảng 90 giây cho hơi mịn, bạn cho thêm 500ml nước sôi để nguội vào xay thêm 60 giây nữa cho đến khi hỗn hợp thật mịn mượt. Cuối cùng, bạn cho sữa đậu xanh vào ngăn mát tủ lạnh để hỗn hợp đặc lại, khi pha uống sẽ ngon hơn.\n\n**Bước 3: Xay rau má**\nBạn rửa sạch 250gr rau má tươi, để ráo rồi cho vào máy xay cùng 500ml nước lọc. Bạn bấm máy xay 2 lần, mỗi lần 60 giây cho rau má nhuyễn mịn. Sau đó, bạn đổ rau má qua túi lọc hoặc rây lọc để vắt lấy nước cốt (không nên vắt quá kỹ để tránh bị đắng). Với khoảng 600ml nước cốt rau má thu được, bạn cho vào 90gr đường cát rồi khuấy hoặc xay sơ cho đường tan hết.\n\n**Bước 4: Thành phẩm**\nBạn chuẩn bị ly lớn, đổ khoảng 150ml hỗn hợp đậu xanh sữa dừa vào trước. Tiếp theo, bạn cho đầy đá viên vào ly. Cuối cùng, bạn từ từ rót nước rau má đã pha đường lên phía trên là hoàn tất. Rau má đậu xanh sữa dừa sau khi hoàn thành có màu sắc phân tầng đẹp mắt với lớp xanh đậm của rau má và lớp vàng nhạt của đậu xanh. Khi uống, bạn sẽ cảm nhận được vị thanh mát của rau má tươi, hòa cùng độ bùi bùi của đậu xanh và độ béo ngậy, thơm lừng của sữa dừa. Nếu thích, bạn có thể thêm topping trân châu hoặc thạch lá dứa để món nước thêm hấp dẫn.	10	20	5	Easy	Published	49ccbba7-0b44-4376-899a-c0689813056a	1c7a1ddf-c7eb-4029-8fe4-49f5ea29a8b0	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	1	213
12ecd2b0-8b5a-5864-8643-b81bda0136e2	Trà tắc để bán thơm ngon đắt khách, giải nhiệt ngày hè	tra-tac-de-ban-thom-ngon-dat-khach-giai-nhiet-ngay-he	Bạn đang tìm cách làm trà tắc để bán vừa ngon vừa đắt khách? Cùng vào bếp với công thức pha chế chuẩn vị, bí quyết chọn trà và ủ trà thơm lừng. Đảm bảo ly thức uống giải khát của bạn sẽ có hương vị chua ngọt khó cưỡng, thu hút mọi khách hàng.	### Hướng dẫn cách nấu: Trà tắc để bán thơm ngon đắt khách, giải nhiệt ngày hè\n\n**Bước 1: Ủ trà thơm ngon chuẩn vị**\nĐầu tiên, bạn cho 30 gr trà lài và 30 gr hồng trà vào chung một bình hoặc tô lớn. Thêm vào 2 lít nước đun xôi vào. Đậy nắp kín và ủ trà trong vòng đúng 10 phút.\n\n**Bước 2: Nấu nước đường sánh kẹo**\nCho 500 gr đường và 1/5 muỗng cà phê muối vào nồi. Tiếp đến, thêm 500 ml nước lọc. Bắc nồi lên bếp, mở lửa vừa và dùng giá khuấy đều liên tục để đường tan hoàn toàn, tránh bị khét ở đáy nồi. Khi nước đường sôi lên và đường vừa tan hết, tắt bếp ngay. Không cần nấu quá lâu vì nước đường sẽ tự sánh kẹo khi nguội. Để nước đường nguội hoàn toàn.\n\n**Bước 3: Sơ chế và lấy nước cốt tắc**\nRửa sạch tắc, cắt đôi và vắt lấy nước cốt. Bạn có thể dùng dụng cụ vắt cam hoặc vắt bằng tay. Loại bỏ hạt để nước cốt tắc không bị đắng.\n\n**Bước 4: Công thức pha chế trà tắc giải khát**\nKhi nước cốt trà và nước đường đã nguội hoàn toàn, chúng ta bắt đầu pha chế. Với ly có dung tích 1 lít, bạn cho vào lần lượt: 120 ml nước cốt trà, 150 ml nước đường, 30 ml nước cốt tắc. Khuấy đều hỗn hợp hoặc cho vào bình lắc và lắc mạnh để các nguyên liệu hòa quyện vào nhau. Cuối cùng, thêm đá viên đầy ly tùy theo sở thích và nhu cầu kinh doanh của bạn.\n\n**Bước 5: Thành phẩm**\nLy trà tắc thơm ngon, chua ngọt hài hòa đã sẵn sàng để thưởng thức hoặc phục vụ khách hàng. Màu trà vàng óng đẹp mắt, hương thơm của trà lài, hồng trà và tắc quyện vào nhau tạo nên một thức uống giải khát tuyệt vời cho những ngày nắng nóng. Đừng quên trang trí thêm vài lát tắc mỏng để ly nước thêm phần hấp dẫn nhé!	10	20	12	Easy	Published	49ccbba7-0b44-4376-899a-c0689813056a	7c46cda2-3fd0-431a-894f-c0b15881fbfb	2026-11-20 09:11:10.119014+00	450.00	25.00	45.00	18.00	4.00	650.00	2026-11-20 09:11:10.119014+00	2026-11-20 09:11:10.119014+00	f	\\x0000000000000001	0	215
4706ef19-ad91-4855-ac71-a904326e17e1	Món Thử Nghiệm Độ Bền Dữ Liệu Sau Khởi Động Lại	mon-thu-nghiem-do-ben-du-lieu-sau-khoi-dong-lai	Mô tả công thức thử nghiệm để kiểm tra tính bền vững của dữ liệu.	### Hướng dẫn thử nghiệm\nBước 1: Nấu thử\nBước 2: Hoàn thành	15	25	4	Medium	Draft	b138f0a7-08c2-4041-a281-0a7eb2e63094	852cc4dc-913d-4d95-8962-4c5407d77d3c	\N	0.00	0.00	0.00	0.00	\N	\N	2026-11-20 10:31:08.302673+00	2026-11-20 10:31:08.253424+00	f	\\x391acc5139f2834ab2fb7e10be36d6d5	0	0
9cf5ba46-1b6e-4925-991c-8f2ed99ecf47	Món Thử Nghiệm Bền Vững Dữ Liệu Sau Khởi Động Lại	mon-thu-nghiem-ben-vung-du-lieu-sau-khoi-dong-lai	Công thức kiểm thử tính năng lưu trữ dữ liệu bền vững và không bị mất sau khi restart.	### Hướng dẫn chi tiết\nBước 1: Chuẩn bị nguyên liệu\nBước 2: Chế biến món ăn	15	20	4	Medium	Published	b138f0a7-08c2-4041-a281-0a7eb2e63094	852cc4dc-913d-4d95-8962-4c5407d77d3c	2026-11-20 10:40:31.64953+00	0.00	0.00	0.00	0.00	\N	\N	2026-11-20 10:40:31.503473+00	2026-11-20 10:40:31.945853+00	t	\\x38770435edb2ba46afe7106ee924f89e	1	0
7111f1ae-df61-4e09-8bbd-f37fc54e3ebd	Test Recipe Mon Khai Vi Test	test-recipe-mon-khai-vi-test	Description of test recipe	Instructions	15	20	4	Medium	Draft	b138f0a7-08c2-4041-a281-0a7eb2e63094	852cc4dc-913d-4d95-8962-4c5407d77d3c	\N	0.00	0.00	0.00	0.00	\N	\N	2026-11-20 10:47:03.155095+00	2026-11-20 10:47:03.154283+00	f	\\xe8fbb2d8d9b47c47be5b599559e1a2d8	0	0
94316a16-622a-47c9-a58d-dcb00ad86454	Món Thử Nghiệm Bền Vững 1795171736	mon-thu-nghiem-ben-vung-1795171736	Công thức kiểm thử tính năng lưu trữ dữ liệu bền vững và không bị mất sau khi restart.	### Hướng dẫn chi tiết\nBước 1: Chuẩn bị nguyên liệu\nBước 2: Chế biến món ăn	15	20	4	Medium	Published	b138f0a7-08c2-4041-a281-0a7eb2e63094	852cc4dc-913d-4d95-8962-4c5407d77d3c	2026-11-20 10:48:56.938837+00	0.00	0.00	0.00	0.00	\N	\N	2026-11-20 10:48:56.744573+00	2026-11-20 10:48:57.174115+00	t	\\x11533d7b6031ad46888c6f59a6b99a08	1	0
4898af79-68c6-45a2-a68b-3dec4bf2f88c	Món Nháp Bí Mật Chưa Xuất Bản [Draft 1795174477]	mon-nhap-bi-mat-chua-xuat-ban-draft-1795174477	Mô tả nháp chỉ tác giả mới thấy.		10	20	2	Easy	Draft	b138f0a7-08c2-4041-a281-0a7eb2e63094	852cc4dc-913d-4d95-8962-4c5407d77d3c	\N	0.00	0.00	0.00	0.00	\N	\N	2026-11-20 11:34:56.397959+00	2026-11-20 11:34:56.824519+00	t	\\x8bca935ab61e49439aacdad7bb50ffd3	0	0
8fb6b8bb-aad6-4a1e-8dbc-cc9ea67452e6	Bò Né Sốt Tiêu Đen Phô Mai Đặc Biệt [Test Persistence 1795174765]	bo-ne-sot-tieu-den-pho-mai-dac-biet-test-persistence-1795174765	Món bò né thơm lừng sốt tiêu đen phô mai béo ngậy dùng kèm bánh mì nóng hổi, thịt bò mềm ngọt chuẩn vị tiệc gia đình.		25	15	4	Medium	Published	b138f0a7-08c2-4041-a281-0a7eb2e63094	852cc4dc-913d-4d95-8962-4c5407d77d3c	2026-11-20 11:39:25.959626+00	0.00	0.00	0.00	0.00	\N	\N	2026-11-20 11:39:25.184638+00	2026-11-20 11:39:36.79637+00	t	\\xa8d143e6bead33448c32963adba4bef9	1	222
9c3f24f7-b63a-4069-9203-2363f19dde72	Món Nháp Bí Mật Chưa Xuất Bản [Draft 1795174765]	mon-nhap-bi-mat-chua-xuat-ban-draft-1795174765	Mô tả nháp chỉ tác giả mới thấy.		10	20	2	Easy	Draft	b138f0a7-08c2-4041-a281-0a7eb2e63094	852cc4dc-913d-4d95-8962-4c5407d77d3c	\N	0.00	0.00	0.00	0.00	\N	\N	2026-11-20 11:39:36.455587+00	2026-11-20 11:39:36.854196+00	t	\\xf61197c9a0361c4e9c139c2abf227d54	0	0
\.


--
-- Data for Name: RefreshTokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RefreshTokens" ("Id", "UserId", "TokenHash", "ExpiresAt", "RevokedAt", "ReplacedByTokenHash", "CreatedAt", "CreatedByIp") FROM stdin;
5949d7f4-c553-4c3c-8e7e-85d8b1ee6ddc	3167970c-6c76-4509-aae1-1436c28a22a9	673d692d907d0fcc929b29bd0e0752a37730f53b85c03661eecdc5992b975572	2026-10-14 08:14:47.622543+00	\N	\N	2026-10-07 08:14:47.622857+00	::1
a953f268-d838-4f9e-a4d9-a06333928a1d	3167970c-6c76-4509-aae1-1436c28a22a9	1d3df37225d4ef7431187700ec417c5e72c26ea24675fc3c5a30dc0deb441ccf	2026-10-14 08:30:40.546007+00	\N	\N	2026-10-07 08:30:40.546073+00	::1
9359b5cf-c741-4233-b5f6-e750b7bc0075	14514bfd-e7b8-42df-980b-c14bcb7561a5	cb968ad60e304e2c96f548e04d56db9afc73505d36e104d6fbfdadd0c06966c4	2026-10-14 12:14:23.816775+00	\N	\N	2026-10-07 12:14:23.816582+00	::1
8865c597-0b7a-4a88-a444-8cfc44570d12	14514bfd-e7b8-42df-980b-c14bcb7561a5	b0b0160af0ae62acef79805bbad0a4e9fbd408d33ae4f829f914ffc726b4826d	2026-10-14 12:16:58.352386+00	\N	\N	2026-10-07 12:16:58.352387+00	::1
5fb0a61b-98ba-41d2-a39c-b0ca685120c8	14514bfd-e7b8-42df-980b-c14bcb7561a5	3ccb76d176d2f40698c98799a310f718c8c2bf35771bc4b93eb16d1835d61565	2026-10-14 12:18:58.791171+00	\N	\N	2026-10-07 12:18:58.791172+00	::1
b26b4ace-9e0c-4e69-b9d8-2fe9f16e9bfa	14514bfd-e7b8-42df-980b-c14bcb7561a5	af2b48332a31718f54a2b1c4567beb0ad16b62eb69c29120cd2d0cdb328751c4	2026-10-14 12:21:45.47746+00	\N	\N	2026-10-07 12:21:45.477461+00	::1
1e7b4cdf-8433-4a35-8f69-01375ab5d6ff	14514bfd-e7b8-42df-980b-c14bcb7561a5	5f0dc5751417db954158169234bc7a2d7583d203f81fb14b8e75c1887c2e0837	2026-10-17 15:39:45.42332+00	\N	\N	2026-10-10 15:39:45.423412+00	::1
227c429f-7a78-4a2f-954c-023e05aa1a38	70485f8d-a5b9-404a-af4e-22c437b5dc5a	eb374a6849c75998eddacb1b698ebb929599576bb4c7307df34dd09cde210f25	2026-10-17 15:47:28.739093+00	\N	\N	2026-10-10 15:47:28.739075+00	::1
ec226c2a-bf12-4c26-8197-d7ae08f9f0fe	15ade563-e497-4362-98a1-e6ebb41f0c71	26db4978a0b640290c3df649e1616973bdf3a4d916139eade8f1c6ca2b4f952d	2026-10-17 15:54:42.97405+00	\N	\N	2026-10-10 15:54:42.974045+00	::1
3fdde805-7635-4e90-9c2c-e67e27d7f0d6	70485f8d-a5b9-404a-af4e-22c437b5dc5a	5c3314a5c931ed03b017e339801402d67b2f41d221734ac2fb4e59742b7ab1a6	2026-10-17 16:26:15.684125+00	\N	\N	2026-10-10 16:26:15.684209+00	::1
3d6654bd-b491-4a9b-ac0b-cdfc6e3b1ad0	70485f8d-a5b9-404a-af4e-22c437b5dc5a	fc5b39353ffaa44bb0bb10c93883b0ea04df964054442a2012c7bcd075b19038	2026-10-17 16:34:10.205576+00	\N	\N	2026-10-10 16:34:10.205578+00	::1
dd44c554-2181-4cc4-a2a4-08e167f3cf36	70485f8d-a5b9-404a-af4e-22c437b5dc5a	a5418602206e400d97ee7c79386e1fcdae7e0c165587dca42571f9c8af2efb5b	2026-10-17 16:49:42.082289+00	\N	\N	2026-10-10 16:49:42.08229+00	::1
6644ebad-0ba8-4ca9-b303-daf59ec3e0a6	70485f8d-a5b9-404a-af4e-22c437b5dc5a	2cc0c50891e740c4d1402caaa0d8f6da36715055b809da0ad636eeb010d794ab	2026-10-17 17:06:49.558113+00	\N	\N	2026-10-10 17:06:49.558114+00	::1
af4b444a-c0f0-4572-bdf1-33631380c4fd	15ade563-e497-4362-98a1-e6ebb41f0c71	6f15ef1a6f14fc0721f90d432ada5630535bed5b34450c0d24eb750c7516620c	2026-10-17 17:16:05.360684+00	\N	\N	2026-10-10 17:16:05.360685+00	::1
66e3fff2-d012-4e7b-a497-51bfbe9427db	70485f8d-a5b9-404a-af4e-22c437b5dc5a	a095d06b12147c1ab2fa2cc0b83bcceeaf38b010ad8538c83c00d85c7000303a	2026-10-17 17:18:00.590372+00	\N	\N	2026-10-10 17:18:00.590373+00	::1
80d1315b-edbf-4b4e-9a9b-9503cfb26370	70485f8d-a5b9-404a-af4e-22c437b5dc5a	206c77e8771a883b44780fb8051c0aafc4def7e12372d209a09637182c4ded44	2026-10-17 17:34:27.688163+00	\N	\N	2026-10-10 17:34:27.688164+00	::1
95c18b3c-96e9-48f0-88f8-c4ae319e3fd4	874af7e8-2987-4682-bc98-d11e2b4b1e4e	8decf77884c1d80bbccabcdcedaae5919fdf7df7970590dd5ba3f7063f62756c	2026-10-17 17:46:33.893861+00	\N	\N	2026-10-10 17:46:33.893863+00	::1
7ae8f9e9-442b-467e-b63c-e3703f438575	874af7e8-2987-4682-bc98-d11e2b4b1e4e	7ced5330595c17960fc42397af97dac281704e605aa8a7797abc9d0ea1f7881c	2026-10-17 17:47:08.535114+00	\N	\N	2026-10-10 17:47:08.535117+00	::1
9947c780-db1d-47e1-ab1b-05305b8acc9f	874af7e8-2987-4682-bc98-d11e2b4b1e4e	f102cd63656f9e9d2aeda25aaae13d1faedd4f94c66baffa0ce63d59c0da0536	2026-10-17 17:57:00.212086+00	\N	\N	2026-10-10 17:57:00.212172+00	::1
cc35c509-bcf0-4ef2-93e2-ab7803035fa6	70485f8d-a5b9-404a-af4e-22c437b5dc5a	9e5ae3d09fc1957f8080715b57d499c8da8b7ef622a5a2d6938f55946f322e7c	2026-10-17 17:59:23.931856+00	\N	\N	2026-10-10 17:59:23.931857+00	::1
11dea44e-3c0e-45fe-a6c2-814093e34895	70485f8d-a5b9-404a-af4e-22c437b5dc5a	9319a873353670f7f5c9185e27c3a6d3c1306b9f2f04ef0257437df429a51112	2026-10-18 10:47:19.08604+00	\N	\N	2026-10-11 10:47:19.086147+00	::1
73d3ca8b-714b-451b-9554-9e5734a11cbb	874af7e8-2987-4682-bc98-d11e2b4b1e4e	550201e526e00480ad87c62f316202f5274deb7a263210ebeecd8e6a0044ffae	2026-10-18 10:49:45.835162+00	\N	\N	2026-10-11 10:49:45.835164+00	::1
db8f5bda-a9b8-41d9-b1ac-66a95963055a	70485f8d-a5b9-404a-af4e-22c437b5dc5a	0e7333f08b4ca2dbaeee19286d064e39edc914dee2aeeae16ce8a41d05be1e28	2026-10-18 10:55:55.064392+00	\N	\N	2026-10-11 10:55:55.064393+00	::1
d5304c30-776f-43db-9cfd-164a0a5dcf09	15ade563-e497-4362-98a1-e6ebb41f0c71	59c351e9643711e7a03d489be580a42b49ddd3154c84dc3f31ad036ac81b4b80	2026-10-18 11:06:11.237966+00	\N	\N	2026-10-11 11:06:11.237968+00	::1
9efd253b-01cc-46d9-a503-d5b94ec2cb20	70485f8d-a5b9-404a-af4e-22c437b5dc5a	cc141d09de8afead1c22143abd1e27e98e4101152e4801a3d7aa06a1b433a170	2026-10-18 11:40:37.721946+00	\N	\N	2026-10-11 11:40:37.72195+00	::1
f23dff40-8971-43bf-b69b-06e5351dd2a4	874af7e8-2987-4682-bc98-d11e2b4b1e4e	2a6a04cb836a6d09833f31393168c5196418f3ace8c7761e59e68c8afa925c32	2026-10-18 12:19:40.643717+00	\N	\N	2026-10-11 12:19:40.643814+00	::1
f52f7604-f608-402d-a5dc-d7ef6f1fcc24	874af7e8-2987-4682-bc98-d11e2b4b1e4e	da1c2c3ce265399533d97ac04a4c6cbcdc6e7b5613de0c50d59ae2522b43e5ea	2026-10-18 12:19:51.31231+00	\N	\N	2026-10-11 12:19:51.312311+00	::1
a39c7218-8eec-4085-a23b-7dd2eddb224f	874af7e8-2987-4682-bc98-d11e2b4b1e4e	87fd0eedc2ae22de215b5486d7c68112df6b4974fc9a766cb3a56ed8bae01c3c	2026-10-18 12:20:17.265641+00	\N	\N	2026-10-11 12:20:17.265642+00	::1
ee9e8560-e159-4b82-9f2c-a0c52e392795	874af7e8-2987-4682-bc98-d11e2b4b1e4e	d2a9ef32f926dc0cd60bbff87149c2c1722adb82eb223541a5b1405b90c78082	2026-10-18 12:21:09.014065+00	\N	\N	2026-10-11 12:21:09.014066+00	::1
e82fc35f-e750-44bb-bbb3-302e6820c0f9	874af7e8-2987-4682-bc98-d11e2b4b1e4e	6e1ca2f7e4e0d85cf28369b519dedeb08a328646c34ecb71a442723e167fc1b6	2026-10-18 12:23:30.36461+00	2026-10-11 12:27:07.737914+00	\N	2026-10-11 12:23:30.364613+00	::1
5a40e87c-67d0-4c59-a701-ba3e8a1f3e2b	874af7e8-2987-4682-bc98-d11e2b4b1e4e	fef3b125df76da3545ad9403d11b33259af4fdbd692c799828a3bcf1b1344009	2026-10-18 12:28:42.27427+00	\N	\N	2026-10-11 12:28:42.274274+00	::1
ee121beb-cc5a-4082-b62b-1aa030e19cf6	70485f8d-a5b9-404a-af4e-22c437b5dc5a	4837ab9ab52b2b069bcfcc50ac62830e9467d556ff9edac2c63b3883304538d4	2026-10-18 12:39:57.216631+00	\N	\N	2026-10-11 12:39:57.216641+00	::1
2c924b9b-87e6-4076-9ae2-54b74c89b1bf	70485f8d-a5b9-404a-af4e-22c437b5dc5a	ecad0c73bf716b840195340e93ab42d455e5fad469c07ec6cc79dc3d1135f05b	2026-10-28 10:33:09.037382+00	\N	\N	2026-10-21 10:33:09.037463+00	::1
8f35a90e-4ae9-4564-8d75-cdf31c6a545b	70485f8d-a5b9-404a-af4e-22c437b5dc5a	5fe2981d3f96e03bf219b8076729dd12ffc53ef5bd3c4f925817e104f054c2f8	2026-10-28 10:35:54.423946+00	2026-10-21 10:37:56.831102+00	\N	2026-10-21 10:35:54.423947+00	::1
364835db-73d6-4c8a-8aed-f7a208671506	ca98b73a-0982-4a3c-9834-a7df0fd609d3	257aff6d9d86860bdbfa82fca680ae2e62a2e75c4c0d246a3ef1a8975f7c2e97	2026-10-28 10:38:53.022318+00	2026-10-21 10:44:44.063711+00	\N	2026-10-21 10:38:53.02231+00	::1
b0782d41-75dc-4372-b81f-999c6414b200	70485f8d-a5b9-404a-af4e-22c437b5dc5a	1759615a54c872904a0c8003a30ce60a7bf140ba5f051fc3859372d72e4f311b	2026-10-28 10:45:05.888101+00	2026-10-21 10:47:07.504496+00	\N	2026-10-21 10:45:05.888102+00	::1
c11221b0-03d1-42ca-a3ff-02854c5316b4	ca98b73a-0982-4a3c-9834-a7df0fd609d3	0421e1d7e57d3a19068db32c9d261ff41a1aaabab37a9a2f31ba0e04b7607824	2026-10-28 10:47:59.510003+00	2026-10-21 10:51:09.980052+00	\N	2026-10-21 10:47:59.510004+00	::1
c75a077b-fe2e-44cb-9e15-01541ebcc863	70485f8d-a5b9-404a-af4e-22c437b5dc5a	a1b6cb868a181e8d6def448af0c59091dcf694a82707dbad5a33d0c6e8cf3e06	2026-10-28 10:51:32.268669+00	2026-10-21 10:51:49.375427+00	\N	2026-10-21 10:51:32.26867+00	::1
7e323042-ecbc-42f8-af6a-c5d39d9c1c40	874af7e8-2987-4682-bc98-d11e2b4b1e4e	68edf5455864d837173d27802ce8ba606b1579b24ae40e2d47048c8e39cde89b	2026-10-28 10:52:15.783672+00	\N	\N	2026-10-21 10:52:15.783673+00	::1
8c4d6d7c-9ff1-439b-8451-db6486a6bec5	ca98b73a-0982-4a3c-9834-a7df0fd609d3	bb05d2f665e6f01c6ae6180d8293c46780bb93c3d3fb15343143b601ea2e66b4	2026-10-28 11:27:02.121901+00	\N	\N	2026-10-21 11:27:02.121914+00	::1
b70096cb-12b7-4209-a13e-c09b256c457d	a343771d-bafb-4a55-9459-2739d0b00a20	7f2aadccac36a9b89c16e725bc2b8188d4dc19a81955d42e8cd06b5f4b1db331	2026-10-28 11:31:46.487462+00	\N	\N	2026-10-21 11:31:46.487452+00	::1
aff9ba3f-bc56-47f6-99be-496885c8292d	a343771d-bafb-4a55-9459-2739d0b00a20	2e48ee7bef3b12ba47952283ce298aac99136bc2a003d82003c18f7e9acef6ef	2026-10-28 11:32:08.370028+00	\N	\N	2026-10-21 11:32:08.37003+00	::1
8f57de12-d7b1-49d4-b14b-c54b7d460618	a343771d-bafb-4a55-9459-2739d0b00a20	8269c9608112f4ab00d70417204c42901318281bb6a24840b30ced6b6c82abc9	2026-10-28 11:32:13.244921+00	\N	\N	2026-10-21 11:32:13.244925+00	::1
b04805a2-fd0e-4a4d-92c5-9d283210fd84	a343771d-bafb-4a55-9459-2739d0b00a20	1d09a1beef22cd6affe4a3c213c2dc38d6b31f0ddde17b4bd32281bbfbb4796f	2026-10-28 11:47:57.116722+00	\N	\N	2026-10-21 11:47:57.116813+00	::1
9a77106e-779a-42c5-bf07-41fc24f46ba1	a343771d-bafb-4a55-9459-2739d0b00a20	4fc36cd71861356241fa32a9eaf9f5021b402d0b8d075f3ebc0af0755e263ccd	2026-10-28 11:48:12.023697+00	\N	\N	2026-10-21 11:48:12.023703+00	::1
f7a43393-0a96-4a46-a3ac-5a3837231779	ca98b73a-0982-4a3c-9834-a7df0fd609d3	8e5d3a98bdafef5e977a75d6a6340c7dea9fa5c3ed7eb6ba53fabbe89a3847db	2026-10-28 12:02:22.154481+00	2026-10-21 12:02:58.325695+00	\N	2026-10-21 12:02:22.154499+00	::1
2f77c012-2554-429a-8acd-304f4c4a741c	70485f8d-a5b9-404a-af4e-22c437b5dc5a	ba873c88c92c217d6bb8a7bac041ae2b0fdf6ab355fa457e10e26967d2d34bf5	2026-10-28 12:03:17.860933+00	2026-10-21 12:03:54.428579+00	\N	2026-10-21 12:03:17.860935+00	::1
b19d9d57-c2af-4b07-ba04-138639774aab	ca98b73a-0982-4a3c-9834-a7df0fd609d3	5bfe620371227ebbe855147a1763bffd5bfade3598968595198b60bd323bcbbd	2026-10-28 13:51:14.994894+00	2026-10-21 13:51:54.107458+00	\N	2026-10-21 13:51:14.994982+00	::1
95d93aef-d5dd-4f4f-a766-823f0738c38a	70485f8d-a5b9-404a-af4e-22c437b5dc5a	95558b508c409be7505446a41cbb572b6dd0457742f5f809142b6351e5f1828d	2026-10-28 13:52:18.573037+00	\N	\N	2026-10-21 13:52:18.573038+00	::1
152e1e19-a311-40b0-808a-de0d990bf9ca	ca98b73a-0982-4a3c-9834-a7df0fd609d3	f278e3e80caf8fdbbfc21a943e42b264acc1c350d1e9923ac8dbfcea97fad9d0	2026-10-28 14:07:15.550049+00	\N	\N	2026-10-21 14:07:15.550172+00	::1
69913b95-6db2-4295-959b-2fd1889d8f17	422d51e4-91ce-4825-a86f-c097e0462568	932cbaee8e09c235ee7421f45081b1eb961601784690382afa335a515d191f08	2026-10-28 14:15:34.265163+00	\N	\N	2026-10-21 14:15:34.265165+00	::1
d180fe0a-3b4c-4348-9702-4b7cb6f3f872	ca98b73a-0982-4a3c-9834-a7df0fd609d3	9061bdfe8ffd47ecca6104927e92f94e0dabc4aecdf7e80fd4a70c84598031c0	2026-10-28 14:21:37.588273+00	2026-10-21 14:22:20.741586+00	\N	2026-10-21 14:21:37.588287+00	::1
774bcbc2-f38e-453e-80d4-f1eaa9aa1979	70485f8d-a5b9-404a-af4e-22c437b5dc5a	d60836544dbcf0412e1a6cbefffd28978607f9d17d79201a0349f65b11c00184	2026-10-28 14:22:46.414174+00	\N	\N	2026-10-21 14:22:46.414175+00	::1
204cb4f2-60f9-46dc-be72-a2aff5b95557	70485f8d-a5b9-404a-af4e-22c437b5dc5a	369fbfca2a0199487989351559faf6fbf8b0d36d8d01278f39ca73ec770e2b88	2026-10-28 14:49:50.194079+00	\N	\N	2026-10-21 14:49:50.194093+00	::1
2833aa00-f309-40c1-9dbe-4e7159062fe5	70485f8d-a5b9-404a-af4e-22c437b5dc5a	cbe52380756bc95c7d376683fa3919030d3bd01190669d642aa38431a6c23c9e	2026-10-28 15:06:35.095613+00	\N	\N	2026-10-21 15:06:35.095807+00	::1
4ae1b70d-5232-473b-86cb-281845f0a401	ca98b73a-0982-4a3c-9834-a7df0fd609d3	9231321937dc45a4ad4e3aaee63434b1cc809a8d389de5a1cb92428ff2772080	2026-10-28 15:22:17.205669+00	\N	\N	2026-10-21 15:22:17.205683+00	::1
12bd85b0-94d7-4cf4-a232-e9d9861124f5	70485f8d-a5b9-404a-af4e-22c437b5dc5a	553b137e615e3a9f9afdc32131653723f2eca22ceedf6ebad00f3a22cc3a7bb5	2026-11-01 15:04:19.557654+00	\N	\N	2026-10-25 15:04:19.55774+00	::1
b1d97e57-676d-441a-a930-8a9e66a16ab8	422d51e4-91ce-4825-a86f-c097e0462568	86071e648184eb41fb147659a7b1e3029d7671dbb5cb506707706ac3dcbf872f	2026-11-01 16:10:37.500293+00	\N	\N	2026-10-25 16:10:37.500325+00	::1
3356411f-94cb-4c01-af21-75b885225245	70485f8d-a5b9-404a-af4e-22c437b5dc5a	1eab526eae3811cdb24446b4f7daad04c74ba4b252f114ee79f5dff883cd24d8	2026-11-01 16:13:05.354708+00	\N	\N	2026-10-25 16:13:05.354711+00	::1
dc5cbbf8-118d-47e5-9e66-987d2d15a84e	422d51e4-91ce-4825-a86f-c097e0462568	cccfe441c2876c4fce68b9603edc9fc02639e4426c7a1824ef557247f6c0bdd2	2026-11-01 16:27:45.837732+00	\N	\N	2026-10-25 16:27:45.837773+00	::1
a3242d37-e4d4-4bc4-bc02-a322ed9fc27f	422d51e4-91ce-4825-a86f-c097e0462568	393c10c246b1a1e13d75d2fde808601a43e50bf00a06a319df78371adfdc3fd7	2026-11-01 16:27:53.478861+00	\N	\N	2026-10-25 16:27:53.478862+00	::1
2ed0e310-0212-44ed-8908-d41b1ab38999	422d51e4-91ce-4825-a86f-c097e0462568	11744c0f69fbe9dd299bf8c24c1cd42b4234ce1bea13952e12c5d2b8834c96f6	2026-11-01 16:28:05.48022+00	\N	\N	2026-10-25 16:28:05.480221+00	::1
2e083709-d616-49a5-a3d8-32569dcff9d1	422d51e4-91ce-4825-a86f-c097e0462568	c89d53548c2aa7aa56042d5286e6b24d536e077f96e0aa21b0e0ba636b30c72c	2026-11-01 16:28:13.860599+00	\N	\N	2026-10-25 16:28:13.8606+00	::1
0bb773bf-faf5-4ea2-8bd6-245651ed2c91	70485f8d-a5b9-404a-af4e-22c437b5dc5a	7ad6b207c13c3243bd5233aae2734231fb502dcaeaead2063ce6c73f83a2eb22	2026-11-01 16:41:26.790757+00	\N	\N	2026-10-25 16:41:26.79088+00	::1
7b3c7507-d8f8-4362-a643-35f0decf73ab	422d51e4-91ce-4825-a86f-c097e0462568	63e8e28491985e6f18a1c150e385c9dd563bf1b1883818b484ebd2b54456e4af	2026-11-02 06:14:31.194587+00	\N	\N	2026-10-26 06:14:31.194688+00	::1
b0441a48-35ac-4821-9ff6-db5da71a102a	422d51e4-91ce-4825-a86f-c097e0462568	8e36c049964539486538b1f638e30c5120665cf4fc5b0eabc6ec77a4255838a3	2026-11-02 06:42:53.605447+00	\N	\N	2026-10-26 06:42:53.605449+00	::1
101d10a5-0824-41d3-b2e1-bdb62b86908a	422d51e4-91ce-4825-a86f-c097e0462568	7dce3c423ffd7e48702860b42d0d829555df5dc08b152909b7b93ba750fdb4d2	2026-11-02 06:43:56.687451+00	\N	\N	2026-10-26 06:43:56.687453+00	::1
b6f81f61-6a76-4aaa-849a-e89119d1a8a5	70485f8d-a5b9-404a-af4e-22c437b5dc5a	33be56602a01052a3b43d722ce7ea5e814d77f147e5b052b61579f0c8c1892fb	2026-11-02 14:39:09.468409+00	\N	\N	2026-10-26 14:39:09.468508+00	::1
ab481009-7b6e-4968-b41e-1b5221f75169	422d51e4-91ce-4825-a86f-c097e0462568	0562f4077a1bb18330a7fcce14e3c6adcd24de710e262c7c87fee354eddf9cbd	2026-11-02 15:42:09.468109+00	\N	\N	2026-10-26 15:42:09.468113+00	::1
96e24726-4a84-4683-8a09-ff05e6d1d51c	422d51e4-91ce-4825-a86f-c097e0462568	4aabfa21b43d7e4e725dc4606cfd43d899f63bcac9d0f1cce13d05c557b1433e	2026-11-02 15:43:32.638082+00	\N	\N	2026-10-26 15:43:32.638084+00	::1
c08a9255-9ae7-43f1-94bc-a7cb1137ce74	422d51e4-91ce-4825-a86f-c097e0462568	cd5895c58e986156403ca093586c5b6b90b67824cb0c5e5df3ca184a2438ecaf	2026-11-02 15:44:34.843858+00	\N	\N	2026-10-26 15:44:34.843858+00	::1
4ccc273a-52d8-4c58-9f26-7df40e037d85	ca98b73a-0982-4a3c-9834-a7df0fd609d3	a7f48ca402427cf7c7c0cc0c3c501233a18cb3c1abc33c7740262f86ca47dfbc	2026-11-02 15:49:14.586895+00	\N	\N	2026-10-26 15:49:14.586897+00	::1
b66c5cc1-34e2-4113-bebf-20f3f74d662c	422d51e4-91ce-4825-a86f-c097e0462568	f3482ab88a582c96559ed9f0cd77319d2d9ce61c4b84520556ca4377e3c5f181	2026-11-03 02:52:41.747203+00	\N	\N	2026-10-27 02:52:41.74729+00	::1
5cc9b72a-fde8-47f7-9a6e-9a3d293911a4	422d51e4-91ce-4825-a86f-c097e0462568	be6ec753192e8fde782c6dfe91cfcdf9d372fb1cc896716a1702a0236539aee3	2026-11-03 02:53:12.862078+00	\N	\N	2026-10-27 02:53:12.862082+00	::1
0fdbe4b8-330d-48a9-9127-1ddbe5312cbf	422d51e4-91ce-4825-a86f-c097e0462568	514c4fd1242e5f48cbbad72093169adf55bd16d4e3ce90dd23a317ed262ad063	2026-11-03 02:54:15.713306+00	\N	\N	2026-10-27 02:54:15.713309+00	::1
74543bc9-7244-464a-972a-d1552d85416d	70485f8d-a5b9-404a-af4e-22c437b5dc5a	d0746aeccf5bca2119eaf2e5632ef83db1ebc658e90d0187f16eaf6d91fd9fab	2026-11-03 02:58:00.048932+00	\N	\N	2026-10-27 02:58:00.048942+00	::1
e7f0eef6-8032-4e99-af33-670c011d1216	422d51e4-91ce-4825-a86f-c097e0462568	04c4d4655be21e259da125465dda8e5509167025b523f43c6928f0cfa136e70c	2026-11-03 03:22:53.005173+00	\N	\N	2026-10-27 03:22:53.0052+00	::1
cdb7d217-5986-4185-be47-c055288d74af	422d51e4-91ce-4825-a86f-c097e0462568	60a295801a83daef8133f37a41049a6ca9e762a6d99fd6f1b53a11f63751967c	2026-11-03 03:24:28.376608+00	\N	\N	2026-10-27 03:24:28.376613+00	::1
982a129b-a732-4547-8bcf-d2b5f8d9a615	422d51e4-91ce-4825-a86f-c097e0462568	4deb6a48d8009dc396467624d91c8e01aae69a44afc39a101914409bb3cc2539	2026-11-03 03:25:45.359759+00	\N	\N	2026-10-27 03:25:45.359759+00	::1
8963c042-b464-4932-853c-0ef6eb5678b6	422d51e4-91ce-4825-a86f-c097e0462568	9afb6fda054369fc89d92aa297662a2ff56979a7079fa785eadafe8703a13e65	2026-11-03 03:26:46.357527+00	\N	\N	2026-10-27 03:26:46.357528+00	::1
8e446e96-0fb9-418d-b1a1-a680782e786d	852cc4dc-913d-4d95-8962-4c5407d77d3c	b587aab234558492ea85605dae33c66faa0d140cb7de0ec4f67340cf28a7bac6	2026-11-03 03:47:52.442825+00	\N	\N	2026-10-27 03:47:52.442925+00	::1
d3dd6de4-17e6-4491-be03-8b0292f1a358	852cc4dc-913d-4d95-8962-4c5407d77d3c	db99f914d22a2fe2910a4083c0c3a601f02fc69c08a994610c21646c7eb7d1d2	2026-11-03 03:48:42.66638+00	\N	\N	2026-10-27 03:48:42.666383+00	::1
95991e41-5947-47ef-b40d-e26e7f411166	852cc4dc-913d-4d95-8962-4c5407d77d3c	6c6587bc2263c1c2f94a4e4c0724b7a5238f2d90a77b4b32ce75e9789567b522	2026-11-03 03:49:03.538808+00	\N	\N	2026-10-27 03:49:03.538809+00	::1
f1a34317-edd8-4d7c-82b1-5ce867f0276c	70485f8d-a5b9-404a-af4e-22c437b5dc5a	edda8688c76337905edb9e488bdcdda5bc0755579e11aab52e6675b15d555205	2026-11-03 03:56:01.643587+00	\N	\N	2026-10-27 03:56:01.643588+00	::1
e85b2742-8996-4bea-81f1-23989bab43d7	852cc4dc-913d-4d95-8962-4c5407d77d3c	96d9c5b69054c681df9aa4c5922e92b583ca52bc2a1eaa660cd43c1a1f053fc9	2026-11-03 04:09:36.901185+00	\N	\N	2026-10-27 04:09:36.9012+00	::1
83e6a0a5-3ae5-4d06-a873-02bbd7cbb107	852cc4dc-913d-4d95-8962-4c5407d77d3c	c6a4d6b83b81ed4976591bbe59bce4ec445b424b61ebbcafa089489bbd1804cc	2026-11-03 04:11:06.717031+00	\N	\N	2026-10-27 04:11:06.717046+00	::1
51a4d592-24b8-4c5e-818f-766550cd75fc	ca98b73a-0982-4a3c-9834-a7df0fd609d3	1baadc14640d074979f95c3cc78f7f58661956329948d6298c7202d8af9dac2c	2026-11-03 10:08:49.427988+00	\N	\N	2026-10-27 10:08:49.428085+00	::1
2ff35cdc-5231-4b5e-932a-2c7d9551f6aa	ca98b73a-0982-4a3c-9834-a7df0fd609d3	9e98cf0530b8ed1d746e6108c5fe77f07b4ffa6afc70bc4994da251094714b99	2026-11-04 07:34:47.208784+00	\N	\N	2026-10-28 07:34:47.208869+00	::1
4ae62b58-e604-4c33-803f-415e3ac391ec	ca98b73a-0982-4a3c-9834-a7df0fd609d3	1ef78912eace980f2fa8b94789e2efd97c32b37bef8acdda07ac0ac1f1f93563	2026-11-04 08:01:47.110311+00	2026-10-28 08:02:34.513388+00	\N	2026-10-28 08:01:47.110313+00	::1
78a97db8-33ae-4f98-8bc6-b057cbbd987d	70485f8d-a5b9-404a-af4e-22c437b5dc5a	7f8b6b1dd659d10750332a40f6d70de9b40bfe53f1f6d4235fc74787096e7f60	2026-11-04 08:02:53.95747+00	\N	\N	2026-10-28 08:02:53.957471+00	::1
717c62ff-2e0c-41e4-88f7-ac03736f9aab	ca98b73a-0982-4a3c-9834-a7df0fd609d3	2f82a86e91776d540ce7a073485c53725e7d50dfaafa95890556a6dbce72cfed	2026-11-04 08:29:27.749715+00	\N	\N	2026-10-28 08:29:27.749717+00	::1
e927cd32-6f8b-4b58-bcc1-4d3aea542d1a	a343771d-bafb-4a55-9459-2739d0b00a20	b68fc978d897174bf6d1fd5ea0bddb52f711ac5af1baddd0c7c72f99d7d60bec	2026-11-04 08:57:11.369721+00	\N	\N	2026-10-28 08:57:11.369724+00	::1
3fbfca14-8af5-4538-9427-77686cd5c796	a343771d-bafb-4a55-9459-2739d0b00a20	f3bf6bf319d2c786dab773f13b8529c590b0cefa659dad3e8cdb98ad97bb0870	2026-11-04 08:58:06.98393+00	\N	\N	2026-10-28 08:58:06.983931+00	::1
2e8e04a8-5118-4263-b583-728cbc380c5e	70485f8d-a5b9-404a-af4e-22c437b5dc5a	210fff7cc019be62fe6dffdb021b17b1b2114d405d3158a98ff723394f9c0fb5	2026-11-04 09:03:06.448954+00	\N	\N	2026-10-28 09:03:06.448955+00	::1
ca30c4a7-9669-4e51-b2bd-cecf979c70e0	70485f8d-a5b9-404a-af4e-22c437b5dc5a	e532b2ca05402add37ff11ec43e4e3ed38bad9724429b91ba4491327bb617d66	2026-11-04 10:17:18.360863+00	2026-10-28 10:17:43.076997+00	\N	2026-10-28 10:17:18.361035+00	::1
d6f71246-6560-4612-88a9-e87a899681c0	483865f1-1295-464b-95c1-f7502f5b7a16	653439f00297b36ae519abd703892a1a6946969247e7c7ef7086feb00b592feb	2026-11-04 10:20:15.466329+00	2026-10-28 10:20:18.604672+00	\N	2026-10-28 10:20:15.466311+00	::1
b52aaf1f-1039-4087-a0c0-5a9629d2a01a	483865f1-1295-464b-95c1-f7502f5b7a16	823ea9113e9ca10441ee83d4d0c244e3616eb5112bffabad713aa33b01b94d25	2026-11-04 10:21:14.343558+00	2026-10-28 10:21:26.917301+00	\N	2026-10-28 10:21:14.34356+00	::1
0749d03c-dee4-4700-9389-f0047fab147a	ca98b73a-0982-4a3c-9834-a7df0fd609d3	771eb8744dca6725ba172ac4df9f64b72f8d9d77d21b5f5f6eca1b6bc2ea8bcc	2026-11-04 10:21:46.423686+00	2026-10-28 10:22:27.396299+00	\N	2026-10-28 10:21:46.42369+00	::1
99fc2e4d-cb12-4171-adde-4dc939a41dc1	a343771d-bafb-4a55-9459-2739d0b00a20	fba139eaff1c45774cbc7abd98d101ca71471d93a7dcac3ce76025fe3726eeb6	2026-11-04 10:22:45.09683+00	2026-10-28 10:26:18.239312+00	71efa2c3b81939ca2af0c999feabe1982b6fa75b05418f81da0f7714b3406037	2026-10-28 10:22:45.096834+00	::1
446bb13b-dc0e-401c-a3fe-036b056eb5f7	a343771d-bafb-4a55-9459-2739d0b00a20	71efa2c3b81939ca2af0c999feabe1982b6fa75b05418f81da0f7714b3406037	2026-11-04 10:26:18.248215+00	2026-10-28 10:43:57.474991+00	ece5b2782a4a876fe4cac5d40498edfb2fca18becc83b142f8c7eb55665d9113	2026-10-28 10:26:18.248229+00	::1
c7027ef0-bb2e-426b-b8bb-eac46fb34eeb	a343771d-bafb-4a55-9459-2739d0b00a20	ece5b2782a4a876fe4cac5d40498edfb2fca18becc83b142f8c7eb55665d9113	2026-11-04 10:43:57.630768+00	2026-10-28 10:48:19.943318+00	\N	2026-10-28 10:43:57.630775+00	::1
aa66432a-1604-4609-a414-9a75035cf45a	70485f8d-a5b9-404a-af4e-22c437b5dc5a	73bf3b8e85758dff799781cbcacc5e66ae7355f5f5b1da6f497df1464afd44e2	2026-11-04 10:48:40.06749+00	2026-10-28 11:32:23.269755+00	08803f12ab65ffe7c1b3da4941795a4181f0cd10f647a2701da12edfa103a886	2026-10-28 10:48:40.067492+00	::1
1284e2a7-4167-4c20-bff2-d33081c7d718	70485f8d-a5b9-404a-af4e-22c437b5dc5a	08803f12ab65ffe7c1b3da4941795a4181f0cd10f647a2701da12edfa103a886	2026-11-04 11:32:23.291521+00	2026-10-28 11:33:40.972475+00	\N	2026-10-28 11:32:23.291526+00	::1
c0f7e7ad-4289-4471-9e43-bf346aa4487e	ca98b73a-0982-4a3c-9834-a7df0fd609d3	034d9aadd2bec5ff76e5db67b9d8a573e9ef7150ab13bf8a259ee01ae6b05170	2026-11-04 11:36:31.85498+00	2026-10-28 11:53:13.718698+00	807836b24469487c2be9be2eebdc6679ffdf5959770c5d7aaaed609991c2f020	2026-10-28 11:36:31.854981+00	::1
aa0d232f-0982-4a51-b709-0f601f2b66d1	ca98b73a-0982-4a3c-9834-a7df0fd609d3	807836b24469487c2be9be2eebdc6679ffdf5959770c5d7aaaed609991c2f020	2026-11-04 11:53:13.727369+00	2026-10-28 11:59:40.513879+00	\N	2026-10-28 11:53:13.727374+00	::1
93761e3e-c6c8-4c20-8ad2-378fe6add786	70485f8d-a5b9-404a-af4e-22c437b5dc5a	a38a678a208729f5e5de9f4118652447cfd793997608a36db77b851932f1d4c6	2026-11-04 11:59:54.125708+00	2026-11-03 12:31:09.321068+00	de9f048b013cdd3e86a1e196f4f07bc0a70300cab8e3e801a831261711c0f685	2026-10-28 11:59:54.125709+00	::1
77cf0fbe-35db-4e47-a04b-6256cd28bf06	70485f8d-a5b9-404a-af4e-22c437b5dc5a	de9f048b013cdd3e86a1e196f4f07bc0a70300cab8e3e801a831261711c0f685	2026-11-10 12:31:09.438461+00	2026-11-03 12:47:48.466569+00	0cee60d4fa028874aea389c0ffc9b02ed54f468ee1538b406e7fa7bd0512788e	2026-11-03 12:31:09.438468+00	::1
0221c88f-1d02-4a92-919a-9b7a5974155d	70485f8d-a5b9-404a-af4e-22c437b5dc5a	0cee60d4fa028874aea389c0ffc9b02ed54f468ee1538b406e7fa7bd0512788e	2026-11-10 12:47:48.488969+00	2026-11-03 13:12:58.561245+00	a33cc623e90b794ac501e3e37922aa0018d1b1447b13f61eac4b705edb5b5af0	2026-11-03 12:47:48.488974+00	::1
af3b9bc1-a50c-4074-8c7d-d10862fe344d	70485f8d-a5b9-404a-af4e-22c437b5dc5a	a33cc623e90b794ac501e3e37922aa0018d1b1447b13f61eac4b705edb5b5af0	2026-11-10 13:12:58.596552+00	2026-11-03 13:31:22.154393+00	827be63569e5b25d04d33af0896b926b7c65594e1263df7a047ddc26da0c1698	2026-11-03 13:12:58.596556+00	::1
f9b7c63c-050d-4774-a9b4-42480251b1e6	70485f8d-a5b9-404a-af4e-22c437b5dc5a	827be63569e5b25d04d33af0896b926b7c65594e1263df7a047ddc26da0c1698	2026-11-10 13:31:22.184962+00	2026-11-03 13:45:21.607177+00	64bea1060865898d8396ab305873078337c5f8d07c2858bfef4e4e637076ea96	2026-11-03 13:31:22.184966+00	::1
2c338134-adb9-49a1-8c37-ac6d9ef3bc73	70485f8d-a5b9-404a-af4e-22c437b5dc5a	64bea1060865898d8396ab305873078337c5f8d07c2858bfef4e4e637076ea96	2026-11-10 13:45:21.639169+00	2026-11-03 14:00:44.456073+00	ba36b1b8ac88ebe723d2edc14e612f99ad0f91c0b605cef678fc5bb3b0bd4efb	2026-11-03 13:45:21.639173+00	::1
83aaf237-a51b-4cc2-8a02-21b1dc96f07d	70485f8d-a5b9-404a-af4e-22c437b5dc5a	ba36b1b8ac88ebe723d2edc14e612f99ad0f91c0b605cef678fc5bb3b0bd4efb	2026-11-10 14:00:44.464217+00	2026-11-03 14:22:02.648825+00	8aed5754eea06f1bc00607c89566ed8a4413899530eaeedda1293d884466ea7c	2026-11-03 14:00:44.464222+00	::1
c32cc89b-62ec-42be-93f8-4ce7e313e7b9	852cc4dc-913d-4d95-8962-4c5407d77d3c	2622c6da55a9a78046516c2561134e5b904c1fe9682ee386a3179839d4167321	2026-11-10 14:54:06.083202+00	\N	\N	2026-11-03 14:54:06.083206+00	::1
9ad9a9a0-d6fc-4076-ac59-f8cb6e594522	70485f8d-a5b9-404a-af4e-22c437b5dc5a	8aed5754eea06f1bc00607c89566ed8a4413899530eaeedda1293d884466ea7c	2026-11-10 14:22:02.675659+00	2026-11-03 14:59:51.967612+00	02bc7794ced407b1a795e2a1704c163baf67b0c4320e369648f647f975ac3ca7	2026-11-03 14:22:02.675663+00	::1
9c90498f-b1a3-4f82-b639-b06ccb550d98	70485f8d-a5b9-404a-af4e-22c437b5dc5a	02bc7794ced407b1a795e2a1704c163baf67b0c4320e369648f647f975ac3ca7	2026-11-10 14:59:51.973052+00	2026-11-03 15:16:37.194501+00	934b51ccf1dc0fcd81fc38fd64e4d988a698801437feb61a13b19f4e07a99b8b	2026-11-03 14:59:51.973055+00	::1
09f2febd-d447-4568-aa92-492d02b22c39	852cc4dc-913d-4d95-8962-4c5407d77d3c	abbee11e6a82688800683644e415d1fad69b8b8b137b9fc03a66a8e1cb25fccd	2026-11-10 15:17:41.267824+00	\N	\N	2026-11-03 15:17:41.267825+00	::1
4860f9d1-d201-4acc-9c84-230eee38eda2	852cc4dc-913d-4d95-8962-4c5407d77d3c	28597d3db9f22e444a8b6a519974ad22e68bb8df7e5978811e92a0fba7eb9ff4	2026-11-10 15:18:21.131+00	\N	\N	2026-11-03 15:18:21.131002+00	::1
d7868906-b326-4c9b-9e04-c703f56499e1	70485f8d-a5b9-404a-af4e-22c437b5dc5a	934b51ccf1dc0fcd81fc38fd64e4d988a698801437feb61a13b19f4e07a99b8b	2026-11-10 15:16:37.214215+00	2026-11-03 15:32:20.149567+00	75b1c636d7b304e73069eda3a7b486a3e98ee3f0dcb489d09a3833726f8378cc	2026-11-03 15:16:37.214257+00	::1
ad516906-8769-4f2c-8024-b3e3e681df8d	70485f8d-a5b9-404a-af4e-22c437b5dc5a	75b1c636d7b304e73069eda3a7b486a3e98ee3f0dcb489d09a3833726f8378cc	2026-11-10 15:32:20.160672+00	2026-11-03 15:32:29.530535+00	b3795054357053b5cacc003ceef9b0222ee389b577aa537b1e25725ba77a5386	2026-11-03 15:32:20.160678+00	::1
c705131c-b229-414e-8216-e5bf1e1ca661	852cc4dc-913d-4d95-8962-4c5407d77d3c	0d3f5993fee878cb44e59170adf4f2509876c15059f1f7f4f81ecec476222860	2026-11-10 15:39:32.148317+00	\N	\N	2026-11-03 15:39:32.148321+00	::1
d524d6c9-7192-4d75-825e-7252abd2d41f	70485f8d-a5b9-404a-af4e-22c437b5dc5a	b3795054357053b5cacc003ceef9b0222ee389b577aa537b1e25725ba77a5386	2026-11-10 15:32:29.536156+00	2026-11-03 15:47:49.922998+00	713782706a09ad820ae88383909a23cba78ba94d892ac1ad641c56111dbc0f1e	2026-11-03 15:32:29.53616+00	::1
d14d1dea-4021-4874-8ead-3d02108d7a67	852cc4dc-913d-4d95-8962-4c5407d77d3c	122a31a649b57875b354e1b969992ac52da5b151c4dc0c42ead291f3db7adeff	2026-11-10 15:54:07.61828+00	\N	\N	2026-11-03 15:54:07.618403+00	::1
0eab325c-1f95-4f96-8f7a-b5873dd3b6fa	70485f8d-a5b9-404a-af4e-22c437b5dc5a	713782706a09ad820ae88383909a23cba78ba94d892ac1ad641c56111dbc0f1e	2026-11-10 15:47:49.956345+00	2026-11-03 15:58:26.104377+00	d4ebfdefbcf0652d24ab978225e6195ce335a5bd5ea33a778072142eeaa70992	2026-11-03 15:47:49.956355+00	::1
aa2e3840-a771-43b7-b50a-d3a051e61d00	70485f8d-a5b9-404a-af4e-22c437b5dc5a	d4ebfdefbcf0652d24ab978225e6195ce335a5bd5ea33a778072142eeaa70992	2026-11-10 15:58:26.146174+00	2026-11-03 15:59:53.174643+00	285d934720a9829cc412f641ab8a3c45eb38a20333fdde72657f6ec31e6dab17	2026-11-03 15:58:26.146177+00	::1
0838a32a-4d4d-40d1-906a-735a93f901ab	70485f8d-a5b9-404a-af4e-22c437b5dc5a	285d934720a9829cc412f641ab8a3c45eb38a20333fdde72657f6ec31e6dab17	2026-11-10 15:59:53.180086+00	2026-11-03 16:00:45.518817+00	996af53ca36ad57bcfa0396bf9432c4b1a24a77ff9236044722d04d66756b806	2026-11-03 15:59:53.180093+00	::1
07e5f5ef-2aee-4c25-baec-a972e1282cec	70485f8d-a5b9-404a-af4e-22c437b5dc5a	996af53ca36ad57bcfa0396bf9432c4b1a24a77ff9236044722d04d66756b806	2026-11-10 16:00:45.524677+00	2026-11-03 16:01:14.326243+00	1179c884456f8e2a656fe207e47feabc08a9169bdf220b9df7ef8c46249a6830	2026-11-03 16:00:45.524683+00	::1
f1f9e52f-1e0b-4f34-85fe-e063a3ed6500	70485f8d-a5b9-404a-af4e-22c437b5dc5a	1179c884456f8e2a656fe207e47feabc08a9169bdf220b9df7ef8c46249a6830	2026-11-10 16:01:14.330588+00	2026-11-03 16:01:30.228026+00	\N	2026-11-03 16:01:14.330592+00	::1
71375a66-c30a-4080-839f-2226cb5c1908	a343771d-bafb-4a55-9459-2739d0b00a20	990121d81c1cc0cd28725f38e371e170b4cf6110ab901749aa82e1bbd3b03b8d	2026-11-11 04:49:52.651959+00	\N	\N	2026-11-04 04:49:52.651961+00	::1
40c60583-2743-48e0-9c64-4b9cb00f72b6	a343771d-bafb-4a55-9459-2739d0b00a20	5843ae8440c8e35c3d75fb922e5f11b3f5d1765d3616eefe4bcb81a2601887b7	2026-11-11 04:51:08.06873+00	\N	\N	2026-11-04 04:51:08.068733+00	::1
1ca5f2b3-c49c-40dc-9b1a-41d696feabee	ca98b73a-0982-4a3c-9834-a7df0fd609d3	07a23834f7eec347b085e0747cac56cba87b729ae27c7d0c9447616671e98042	2026-11-10 16:01:40.27746+00	2026-11-03 17:36:54.257962+00	fd862e24d335d490f5163bdf972c77b87894eeb9f32c4e21fb8528b042771c7a	2026-11-03 16:01:40.277462+00	::1
48f1b06b-2687-4dd6-9fd4-154391296841	ca98b73a-0982-4a3c-9834-a7df0fd609d3	fd862e24d335d490f5163bdf972c77b87894eeb9f32c4e21fb8528b042771c7a	2026-11-10 17:36:54.270702+00	2026-11-04 01:16:32.49574+00	cd992419a85d01719df7562af9f9567089a1ab5a39b9d5806a9282f98d8de100	2026-11-03 17:36:54.270706+00	::1
ddd5089e-6f02-4e8a-8367-e1a9bed51127	ca98b73a-0982-4a3c-9834-a7df0fd609d3	cd992419a85d01719df7562af9f9567089a1ab5a39b9d5806a9282f98d8de100	2026-11-11 01:16:32.601209+00	2026-11-04 01:16:49.788188+00	\N	2026-11-04 01:16:32.601217+00	::1
2ba60304-c178-4d39-ba96-7c2b9117d04d	852cc4dc-913d-4d95-8962-4c5407d77d3c	021c0ce0fa8026dd1b5e1bc414a9c0555d6aa174cdd84d355369aaca27cb5a2b	2026-11-11 01:29:50.360899+00	\N	\N	2026-11-04 01:29:50.361039+00	::1
fe04f4a4-b8ba-454a-b25b-3e2e93de7df7	852cc4dc-913d-4d95-8962-4c5407d77d3c	5afe85d4b317377a119e6e952c9c3c5afe23da0383960c1cb5719759dc3d01d6	2026-11-11 01:31:03.963191+00	\N	\N	2026-11-04 01:31:03.963192+00	::1
61c8a0ca-8b11-4eb2-90df-5975494c6ba8	852cc4dc-913d-4d95-8962-4c5407d77d3c	8e48a0c12d0b0b708df5d3549a16b119512a61a039c6ae4ab5432b4a9676b3f1	2026-11-11 01:32:18.494949+00	\N	\N	2026-11-04 01:32:18.49495+00	::1
2c8ab10f-73a9-4575-b6d8-797bdcdcee1d	70485f8d-a5b9-404a-af4e-22c437b5dc5a	5c76091e0787d812f98da6c82506498dbc75a82da87d4aeb755ae7e5250d363c	2026-11-11 01:17:15.3474+00	2026-11-04 01:34:55.147767+00	f5f46bc9f4111b77ce33f0f34d1d00dbf06e0d834569d9d0f54c72765f05f5a7	2026-11-04 01:17:15.347402+00	::1
b52c321e-b293-42f4-8743-932f4c7902f6	70485f8d-a5b9-404a-af4e-22c437b5dc5a	f5f46bc9f4111b77ce33f0f34d1d00dbf06e0d834569d9d0f54c72765f05f5a7	2026-11-11 01:34:55.155053+00	2026-11-04 01:38:44.673045+00	0f2a8ee56ad9bf074d7bd8c0fba078c982e46ff99b1892c9ed161d3b7916baa4	2026-11-04 01:34:55.155057+00	::1
f025740d-ee3b-4923-b88f-9c8c69cecea1	70485f8d-a5b9-404a-af4e-22c437b5dc5a	0f2a8ee56ad9bf074d7bd8c0fba078c982e46ff99b1892c9ed161d3b7916baa4	2026-11-11 01:38:44.680038+00	2026-11-04 02:02:54.190694+00	f4ae2231f39ba02f218a4113659431ec10dcd9132e99732e9dfceed764428421	2026-11-04 01:38:44.680043+00	::1
514e7c4e-e030-4005-80d3-d1a72f404b28	852cc4dc-913d-4d95-8962-4c5407d77d3c	f9319cf63a18109f4f87a3d7edbd47394caa429618bb4b57eea25098321a0073	2026-11-11 02:09:31.598461+00	\N	\N	2026-11-04 02:09:31.598768+00	::1
4be22b90-6659-4cba-bfd1-7ad846ed06b2	852cc4dc-913d-4d95-8962-4c5407d77d3c	9f465432c6de4e57720f36948b6f18f9baf8025b018e208f6617b87f85282f0e	2026-11-11 02:10:35.115457+00	\N	\N	2026-11-04 02:10:35.115458+00	::1
4d0dcd79-07f1-450f-b3cb-741482fd912a	70485f8d-a5b9-404a-af4e-22c437b5dc5a	f4ae2231f39ba02f218a4113659431ec10dcd9132e99732e9dfceed764428421	2026-11-11 02:02:54.20367+00	2026-11-04 02:18:57.957942+00	06a4caf697a6e6fd882dbf850d1cddc18873b210eba5b5d1e8e6b56c8300bc82	2026-11-04 02:02:54.203674+00	::1
bd67a2eb-6621-4de2-8dba-d6ad47e416d3	852cc4dc-913d-4d95-8962-4c5407d77d3c	af5d100baa76d1f8cd9795e0c48719d2f25872adc786df4d71b02b2b0581afe9	2026-11-11 02:29:37.121317+00	\N	\N	2026-11-04 02:29:37.121424+00	::1
234845eb-37ae-48ac-bf45-77d53cbc03ed	a343771d-bafb-4a55-9459-2739d0b00a20	0bd398f3a5ca9937257441d1125dc29d6767c7d45c1b34b2326be29be62dd8eb	2026-11-11 02:29:42.130884+00	\N	\N	2026-11-04 02:29:42.130887+00	::1
90b7133e-1312-4bc6-a6ba-f298f1e77f54	a343771d-bafb-4a55-9459-2739d0b00a20	d539c0f2b40a0833331e722b82cc4dead9990c956e423f49fddaf6d13899d449	2026-11-11 02:52:33.951739+00	\N	\N	2026-11-04 02:52:33.951849+00	::1
4f040542-2098-4796-b3eb-2e3864e00276	a343771d-bafb-4a55-9459-2739d0b00a20	9c470619c73ec019b5ff1d4dd191e730a5a5bcb81f8446c527f1317c07be9b86	2026-11-11 02:52:47.611238+00	\N	\N	2026-11-04 02:52:47.611239+00	::1
5f9eaa8d-d4fb-41c4-8079-383eac6bf2b5	a343771d-bafb-4a55-9459-2739d0b00a20	7b2d67f638d258ad8dd2824ad4a5f16486689c1c30b3b29dd31cde52d8d6ae79	2026-11-11 02:52:53.796089+00	\N	\N	2026-11-04 02:52:53.79609+00	::1
58eae387-5180-40df-ae59-5bd7acbeae10	a343771d-bafb-4a55-9459-2739d0b00a20	61b26deebc3edc026f90900a6d8aa2a917d039e19632308f05e95eee97ddf8cb	2026-11-11 02:53:55.794124+00	\N	\N	2026-11-04 02:53:55.794126+00	::1
b3476b10-7945-4efc-a40d-5631a3d10543	a343771d-bafb-4a55-9459-2739d0b00a20	c8d1539fcffb9b74a81c4526eb5e322712e5a2f0672cb380a24429aa35c0afce	2026-11-11 03:22:27.777967+00	\N	\N	2026-11-04 03:22:27.777984+00	::1
d818a61f-0b86-4ecd-9491-46ceece59865	a343771d-bafb-4a55-9459-2739d0b00a20	7f3c9b2ca23fcbc02fa0580e91bf9953a423c7ecd70161383becffbad04f6ed8	2026-11-11 03:22:33.742296+00	\N	\N	2026-11-04 03:22:33.742296+00	::1
9f642c3b-c965-4a4d-b0ea-b04baa91ef21	a343771d-bafb-4a55-9459-2739d0b00a20	559fc566fc26c6c0150de682c9fcf0e9629ec1d0201d258fafb9bf7a8a1fda8e	2026-11-11 03:22:38.373758+00	\N	\N	2026-11-04 03:22:38.373759+00	::1
60e9a8d1-7b7f-427e-b4a9-579f40ea6df7	a343771d-bafb-4a55-9459-2739d0b00a20	e37ab3d770a91191074c86ed514c701718479d5e08ce4fd6ae5d11d8cb6d82e8	2026-11-11 03:23:27.199834+00	\N	\N	2026-11-04 03:23:27.199836+00	::1
8a65fe6d-a4ff-486d-9b25-518828161d31	a343771d-bafb-4a55-9459-2739d0b00a20	04d2f3921e205aec18537ebb2ba1faa6ec66e50afcfd25dce485aec263d94a5d	2026-11-11 04:31:08.863974+00	\N	\N	2026-11-04 04:31:08.864089+00	::1
d959e428-8d21-49c3-92cd-435232e760af	a343771d-bafb-4a55-9459-2739d0b00a20	782ef56db54cc6e71555a913a37a629a63a0fe9bcc56bd146e526160feb55751	2026-11-11 04:36:05.003537+00	\N	\N	2026-11-04 04:36:05.003538+00	::1
3fc9589d-27cd-413b-ac52-140dd8161a42	a343771d-bafb-4a55-9459-2739d0b00a20	782a3d06a0d3b241ef450847bbae5a75ad527706eac003da1d01ff7594f30cc5	2026-11-11 04:36:16.161393+00	\N	\N	2026-11-04 04:36:16.161395+00	::1
8e422da0-84bb-4ac0-a45e-f6a1088e3de1	a343771d-bafb-4a55-9459-2739d0b00a20	425cea9d10c1e4b1d546f15b6a340d92c056c53d296d9c822cfdce0579e4e5ce	2026-11-11 04:36:21.165124+00	\N	\N	2026-11-04 04:36:21.165126+00	::1
b2ee5e32-fc78-4080-a5b1-6b559369ed57	a343771d-bafb-4a55-9459-2739d0b00a20	e5b81861fd9e55f797af48486dbae3e14ab4badd52d2929d6b30c849c9ef046c	2026-11-11 04:37:57.120152+00	\N	\N	2026-11-04 04:37:57.120154+00	::1
d14f91d4-d890-468c-ab77-ec2369d5a496	a343771d-bafb-4a55-9459-2739d0b00a20	142bef1d85ef752c62e7ac989ff5ef49554b833632102999a3c3d4b4c911d82c	2026-11-11 04:38:50.669169+00	\N	\N	2026-11-04 04:38:50.66917+00	::1
c3c52f2a-ceb5-4f07-b185-d402cca7ba5a	a343771d-bafb-4a55-9459-2739d0b00a20	7c258f75db3d00e281924625d97ffffdb9f7bcb6c8536e8a0168e3068b710899	2026-11-11 04:39:12.2995+00	\N	\N	2026-11-04 04:39:12.299501+00	::1
55c0cd9f-f43e-454b-9979-61647547969e	70485f8d-a5b9-404a-af4e-22c437b5dc5a	06a4caf697a6e6fd882dbf850d1cddc18873b210eba5b5d1e8e6b56c8300bc82	2026-11-11 02:18:57.976612+00	2026-11-04 04:39:49.583693+00	dd4e0cf43ad840440796f8c0299085eeac6971ebcba43aecee124ce7ca90ba94	2026-11-04 02:18:57.976616+00	::1
da5eafee-b682-4e27-99bd-bacc5b4d25de	a343771d-bafb-4a55-9459-2739d0b00a20	b33f5691e57c6716f944949335425e98578ca093de509034ad6b8bfbe3f2393e	2026-11-11 04:39:58.383116+00	\N	\N	2026-11-04 04:39:58.383117+00	::1
aff5addf-28ad-4cfa-94c8-30d5e216e346	a343771d-bafb-4a55-9459-2739d0b00a20	72e14464ac949dd8431c188f778f8133ff120c50ed375ebc6201b0a27867c022	2026-11-11 04:41:44.68089+00	\N	\N	2026-11-04 04:41:44.680891+00	::1
1ec420f1-92ae-4b6b-9a29-79a20b7f5575	a343771d-bafb-4a55-9459-2739d0b00a20	94511e29412b7d2de6c3803416c6342b7a28be0c9168ce1822d9ed3efca18215	2026-11-11 04:43:20.080646+00	\N	\N	2026-11-04 04:43:20.080647+00	::1
780acba7-5f9f-468c-a887-d7cf68e9ca02	a343771d-bafb-4a55-9459-2739d0b00a20	844ce49cc004e7f29f362e6e18b592f5da3bf9c44e014ad19015fb74d8fd8c25	2026-11-11 04:48:45.169264+00	\N	\N	2026-11-04 04:48:45.169267+00	::1
39058bae-c69e-40b0-b9d6-e11cfeab6589	a343771d-bafb-4a55-9459-2739d0b00a20	12bd8079b500f1e6a4fa9e5d7a61b3aeafe9b0ce9019b6d553c34ba2a40b0fa7	2026-11-11 04:49:03.711896+00	\N	\N	2026-11-04 04:49:03.711897+00	::1
fe8f910a-5550-4b44-8f4f-b0529fcd0d90	a343771d-bafb-4a55-9459-2739d0b00a20	df1d7b3c1ab9ad084657dc0b26bcf3b7fab637dc429e6959cf3445c15758a796	2026-11-11 04:49:40.524663+00	\N	\N	2026-11-04 04:49:40.524665+00	::1
0286d158-b2bc-4c81-9cca-f4427711cefc	70485f8d-a5b9-404a-af4e-22c437b5dc5a	dd4e0cf43ad840440796f8c0299085eeac6971ebcba43aecee124ce7ca90ba94	2026-11-11 04:39:49.599595+00	2026-11-04 05:15:48.378554+00	509e28ad3be8ddce9807eda6051fcd40aecec5bf8863d19c1cfe59d327dfa28a	2026-11-04 04:39:49.5996+00	::1
0f5069a0-d55f-47c8-a270-dbf1b31bd633	a343771d-bafb-4a55-9459-2739d0b00a20	5bad10eaf9838a3b9fbaabe2646e81d5a45ca76e2c519ab446920483fcf0ab5f	2026-11-11 04:51:22.21056+00	\N	\N	2026-11-04 04:51:22.210562+00	::1
abf19e4c-cb3a-4af3-9a08-0a8b2640448f	a343771d-bafb-4a55-9459-2739d0b00a20	40fc71c81adc8b7330706210f7687de689ecafc27f2913fcc6490225e64b4fe9	2026-11-11 04:52:15.287246+00	\N	\N	2026-11-04 04:52:15.287248+00	::1
bcad525a-dadb-4567-b025-71f78028e171	a343771d-bafb-4a55-9459-2739d0b00a20	cb271911e68518463b2435ebb89c596d6d7805908876eac05c094ae7a54216d6	2026-11-11 04:52:46.076241+00	\N	\N	2026-11-04 04:52:46.076242+00	::1
ac921ec7-feb8-4719-a30e-d22a4b7d5b1c	a343771d-bafb-4a55-9459-2739d0b00a20	52aca9acd7547b9cf32313450cde18daeaece09be6d70c4b1f40aaba7cc36f5d	2026-11-11 04:53:06.760351+00	\N	\N	2026-11-04 04:53:06.760352+00	::1
82c2709e-c596-47de-86ef-da02851fed69	a343771d-bafb-4a55-9459-2739d0b00a20	eac6124a9594fc41332e0887623f0773714eb1ca08e8651a34d4892fd88dfe58	2026-11-11 04:54:27.166799+00	\N	\N	2026-11-04 04:54:27.166801+00	::1
fdce1aa1-7446-4875-a4b3-0559c4966620	a343771d-bafb-4a55-9459-2739d0b00a20	586cb79e0fb845b2675b1c36405364de2d679ee5a1012496ab6d443a48d7f512	2026-11-11 04:55:45.661902+00	\N	\N	2026-11-04 04:55:45.661904+00	::1
2681ac17-6a4c-4c99-b106-77c1e4b8986b	a343771d-bafb-4a55-9459-2739d0b00a20	d50e297525e76d82fc1b4ee05c6512131f3cd7f262c982d57560b1cd434d26ed	2026-11-11 04:55:51.236499+00	\N	\N	2026-11-04 04:55:51.2365+00	::1
13fd96a9-c69f-4af2-b1c1-3b82ddf705f4	a343771d-bafb-4a55-9459-2739d0b00a20	bc850837db32c78f525d9e2337270368945d4782186f2a8a8092665279a0e78c	2026-11-11 05:05:53.794548+00	\N	\N	2026-11-04 05:05:53.79455+00	::1
6679c0c4-8137-4c1c-b240-ee4c65ef43c0	a343771d-bafb-4a55-9459-2739d0b00a20	c6b5bf296c54dbddc23133dcc0c5b8ed939a3d49d7b8407fd95e863daa93c059	2026-11-11 05:07:10.076534+00	\N	\N	2026-11-04 05:07:10.076535+00	::1
0b62ea4e-b0e0-4acd-8743-d5d51e8310c9	70485f8d-a5b9-404a-af4e-22c437b5dc5a	509e28ad3be8ddce9807eda6051fcd40aecec5bf8863d19c1cfe59d327dfa28a	2026-11-11 05:15:48.404178+00	2026-11-04 05:15:54.011652+00	18d3bf16e67f59f5c65c08ea5fb302807f35d2cbe748a594fb1b7af9761ddc2a	2026-11-04 05:15:48.404183+00	::1
67b306f7-612a-40e3-bf12-afa15afbf284	70485f8d-a5b9-404a-af4e-22c437b5dc5a	18d3bf16e67f59f5c65c08ea5fb302807f35d2cbe748a594fb1b7af9761ddc2a	2026-11-11 05:15:54.018883+00	2026-11-06 07:42:49.712029+00	5e37502a20be49f2d240be79650a55aa60268329df2d8eb5453c8efe0564ecd2	2026-11-04 05:15:54.018889+00	::1
fec06ce7-2ced-44b2-95c0-21a03264d4fb	70485f8d-a5b9-404a-af4e-22c437b5dc5a	5e37502a20be49f2d240be79650a55aa60268329df2d8eb5453c8efe0564ecd2	2026-11-13 07:42:49.798767+00	2026-11-06 07:48:41.589962+00	\N	2026-11-06 07:42:49.798773+00	::1
c5e31573-8d55-4cce-8ae1-6811d399c4bb	ca98b73a-0982-4a3c-9834-a7df0fd609d3	dfd2ac4464d81a300b97f06bb5b338295e32d052fa245fa737644be5f67b7abf	2026-11-13 07:48:52.009226+00	2026-11-06 08:03:59.411477+00	4c4d12fc1201a06c5014f4c0ddf4e8227fa72b1cbb0d75f484d4557322d2e7d7	2026-11-06 07:48:52.009229+00	::1
1670ea60-89f1-4514-92cb-fae06e13139d	a343771d-bafb-4a55-9459-2739d0b00a20	76f69afcbdcbdef1dccaf38886a5a1a414e0c43a016d55dd83df38f1f83e8f1b	2026-11-13 08:15:21.462274+00	\N	\N	2026-11-06 08:15:21.462494+00	::1
b2d238e5-45fe-4c94-9f67-7a4305fbff02	ca98b73a-0982-4a3c-9834-a7df0fd609d3	4c4d12fc1201a06c5014f4c0ddf4e8227fa72b1cbb0d75f484d4557322d2e7d7	2026-11-13 08:03:59.447189+00	2026-11-06 08:18:35.636206+00	13b6379ac4fc517ad29f7cc637b3b9fb936efd0a1d7c006b44705702dfb6ab12	2026-11-06 08:03:59.447197+00	::1
4bbb8b71-8f3c-4c8a-b9a9-dbd08801fb53	ca98b73a-0982-4a3c-9834-a7df0fd609d3	13b6379ac4fc517ad29f7cc637b3b9fb936efd0a1d7c006b44705702dfb6ab12	2026-11-13 08:18:35.645484+00	\N	\N	2026-11-06 08:18:35.645488+00	::1
5caab26e-d228-4593-b1ce-30bd3fcf2196	a343771d-bafb-4a55-9459-2739d0b00a20	a008aba30e30804103c60072ef507bd4b92e75c1e2308b570fc16ccc02f29be0	2026-11-13 08:22:27.410167+00	\N	\N	2026-11-06 08:22:27.410311+00	::1
92fcd2c2-4674-42a4-a70a-c147f1c225d4	ca98b73a-0982-4a3c-9834-a7df0fd609d3	c2121e2b46c981fb41e4f07786505ac40a07dac887750efc785d750dd0d581b8	2026-11-13 08:18:47.129254+00	2026-11-06 08:23:14.161411+00	7a8f17cb478547214d66e0812d512256db5f8322ed8db6efa4a41dae683cd510	2026-11-06 08:18:47.129255+00	::1
696d9f71-0d27-4e37-9ea9-921cd50f82c7	a343771d-bafb-4a55-9459-2739d0b00a20	a30889f47da2b6759462cfd31d19e6fa9dd4295b37c553b437435745a72cf5c5	2026-11-13 08:24:05.953411+00	\N	\N	2026-11-06 08:24:05.953414+00	::1
b589d256-7375-492d-a363-deb7990ffb98	a343771d-bafb-4a55-9459-2739d0b00a20	511b1e10f91b74ca6cb8749d8ad7e3adfca2a98dfdb54618149291f82d1a6079	2026-11-13 08:26:09.717329+00	\N	\N	2026-11-06 08:26:09.717331+00	::1
ca001efb-8dd3-4152-ab95-7bed88db1833	a343771d-bafb-4a55-9459-2739d0b00a20	b8c4f356dc210d7a8001dd7bdc7717d63d101721f7b00568d13080481f086aad	2026-11-13 08:27:00.354459+00	\N	\N	2026-11-06 08:27:00.354462+00	::1
05980fe6-b96f-4273-9c2d-a5d830ff593b	a343771d-bafb-4a55-9459-2739d0b00a20	e5f6a17c22d52cff52235bae2bb3a2e51b3ef02a9c9dd574e2ac32663de63464	2026-11-13 08:42:00.629998+00	\N	\N	2026-11-06 08:42:00.630198+00	::1
01cf3aed-d194-4a37-b01e-2bd6e4330c45	ca98b73a-0982-4a3c-9834-a7df0fd609d3	7a8f17cb478547214d66e0812d512256db5f8322ed8db6efa4a41dae683cd510	2026-11-13 08:23:14.171143+00	2026-11-06 08:46:53.177544+00	a88c7e123aa76bd6b4380694df5b57d7b1b14a45b26c4b3ed461db0904050a02	2026-11-06 08:23:14.171146+00	::1
ef36bbbd-2fb7-4aa4-949f-3821fa8d661b	a343771d-bafb-4a55-9459-2739d0b00a20	b448184a777c12fb7b0002b4057d8acd097dd31c6b82a84943e48975e983ecbc	2026-11-13 08:57:45.390148+00	\N	\N	2026-11-06 08:57:45.390153+00	::1
3e2ebbb9-adca-44c6-a6a5-1cc02549f59d	ca98b73a-0982-4a3c-9834-a7df0fd609d3	a88c7e123aa76bd6b4380694df5b57d7b1b14a45b26c4b3ed461db0904050a02	2026-11-13 08:46:53.185795+00	2026-11-06 09:01:54.857715+00	cdf0f864c0562945234d2c9a50ffc1ee39e0d5ca7d8e933fcb5dcf9de3e8ab49	2026-11-06 08:46:53.185799+00	::1
62d801a4-7a94-49fb-990d-e5963787a9ef	a343771d-bafb-4a55-9459-2739d0b00a20	c02f416752d516a2f68eee176766f1f153035bf5db7218b1916c00ff5205d3b4	2026-11-13 09:22:03.608819+00	\N	\N	2026-11-06 09:22:03.608842+00	::1
89d85a4f-363f-4e14-bf2a-6a73232018db	ca98b73a-0982-4a3c-9834-a7df0fd609d3	cdf0f864c0562945234d2c9a50ffc1ee39e0d5ca7d8e933fcb5dcf9de3e8ab49	2026-11-13 09:01:54.86725+00	2026-11-06 09:25:39.766227+00	37c96b6b526862cc17f03e718d990ff501c04cb8d7a1255a2abb25810a3ea292	2026-11-06 09:01:54.867255+00	::1
3b7c72f2-26ae-4652-b7a5-95c1de94bd4e	ca98b73a-0982-4a3c-9834-a7df0fd609d3	37c96b6b526862cc17f03e718d990ff501c04cb8d7a1255a2abb25810a3ea292	2026-11-13 09:25:39.780663+00	2026-11-06 09:30:19.27785+00	57bab161830fe30924a73f620e0d84c020da344c249a3a1c3235542d2d89a95d	2026-11-06 09:25:39.780666+00	::1
26f3c2ce-ff03-43aa-8824-2a3ddce7d0d8	a343771d-bafb-4a55-9459-2739d0b00a20	9d8822f5076e470f51e21edc7d31e79d2a7283e3ae79634378c712f9fbc8567f	2026-11-13 09:36:29.796154+00	\N	\N	2026-11-06 09:36:29.796202+00	::1
eb373d0d-593a-4b73-97f3-b6a55d0f1e09	ca98b73a-0982-4a3c-9834-a7df0fd609d3	57bab161830fe30924a73f620e0d84c020da344c249a3a1c3235542d2d89a95d	2026-11-13 09:30:19.286681+00	2026-11-06 14:32:21.587576+00	703a6b6bab0b857ec831325739c4a46230ce2d645bf09e0cbee6fa7e1d00aa85	2026-11-06 09:30:19.286687+00	::1
d62099e5-5fae-4b81-86e0-fa0bff70b858	a343771d-bafb-4a55-9459-2739d0b00a20	3e0c41757ca28718abaea1e5ad09c23320b860575b3baac0b8eaaf37bc8db9f9	2026-11-13 14:45:45.900875+00	\N	\N	2026-11-06 14:45:45.900896+00	::1
b5e8ab1d-84bd-4f8d-ace4-fdffa1c0a019	ca98b73a-0982-4a3c-9834-a7df0fd609d3	703a6b6bab0b857ec831325739c4a46230ce2d645bf09e0cbee6fa7e1d00aa85	2026-11-13 14:32:21.621353+00	2026-11-06 14:47:59.597105+00	1323f3a1633d7720ee2f6c003776f2121340c55317c9bf304715bc490634da89	2026-11-06 14:32:21.621363+00	::1
30a5ab77-bb51-4da0-ac9a-a84069d43f33	a343771d-bafb-4a55-9459-2739d0b00a20	ca472ef9ae6861c496fa74ba514e7a5fdf0aab31d08fa0139306813dd72c77b7	2026-11-13 14:56:03.487128+00	\N	\N	2026-11-06 14:56:03.487151+00	::1
05c6fda7-d407-4f7d-8f78-5a86049c1a3a	a343771d-bafb-4a55-9459-2739d0b00a20	4d4561f4861fbf955e23a27d1fc77652bb23a0ca90b2c3be29ab578a73160b66	2026-11-13 15:09:43.859876+00	\N	\N	2026-11-06 15:09:43.859902+00	::1
10652b52-083b-4ac5-9db7-f69c8c20600b	a343771d-bafb-4a55-9459-2739d0b00a20	0d7a8d529ff8ceebf01231d33b4a9edb33ed3a2aad76c923f90d5fa661621291	2026-11-13 15:11:01.553357+00	\N	\N	2026-11-06 15:11:01.553359+00	::1
c4f77cfa-cb23-48e5-b9f6-d66ac904e63b	a343771d-bafb-4a55-9459-2739d0b00a20	6f2969c29dde25948ef972f063bb49e68f6fd14443976f28902d713a4ef76408	2026-11-13 15:12:23.197672+00	\N	\N	2026-11-06 15:12:23.197674+00	::1
617f1e20-faa7-46e6-9f28-c5489653a23e	ca98b73a-0982-4a3c-9834-a7df0fd609d3	1323f3a1633d7720ee2f6c003776f2121340c55317c9bf304715bc490634da89	2026-11-13 14:47:59.607027+00	2026-11-06 15:15:05.532818+00	350c65e1509c987eb6e122f1cc77c91850e75b6a1202bf197fd71f002c671878	2026-11-06 14:47:59.60703+00	::1
21e73cb9-722c-4b3a-b048-181ae712d307	a343771d-bafb-4a55-9459-2739d0b00a20	ee54d1a6e70820deeb376aeb11fb855b72ef6f0ae8eced9bab014f2f6e27a1cb	2026-11-13 15:44:09.466085+00	\N	\N	2026-11-06 15:44:09.46617+00	::1
92ca32c6-5059-473f-a305-4124af238b73	a343771d-bafb-4a55-9459-2739d0b00a20	0eeeaf1334d75875bf8ed86096250dc42f6dc23ec3a71d25cd1f507b5472d50b	2026-11-13 15:44:58.239961+00	\N	\N	2026-11-06 15:44:58.239962+00	::1
3e83966d-a4f1-461b-9457-6c0f6c4024d7	ca98b73a-0982-4a3c-9834-a7df0fd609d3	350c65e1509c987eb6e122f1cc77c91850e75b6a1202bf197fd71f002c671878	2026-11-13 15:15:05.542361+00	2026-11-06 15:56:17.238015+00	71375c5396c96ec53a40e6899dda6ad1d8379cf89c24477215ea3579affaf693	2026-11-06 15:15:05.542365+00	::1
c1b58833-12cd-4ec4-9562-97d1c8cf949c	852cc4dc-913d-4d95-8962-4c5407d77d3c	8fbb3dac7dd0d730d05c743e9086500ccd097e2d7589e46033284ae69acbded5	2026-11-15 06:09:34.664587+00	\N	\N	2026-11-08 06:09:34.664589+00	::1
3f5e0718-9371-4d46-b862-e1db929fcb1e	a343771d-bafb-4a55-9459-2739d0b00a20	a7b45eabecb9c229bc43e09d82cfcff666ad79e2450c03ecb03cda6b5e5ca54b	2026-11-13 15:46:03.515075+00	\N	\N	2026-11-06 15:46:03.515076+00	::1
c12504a4-21f5-4f09-9102-a804c499049f	a343771d-bafb-4a55-9459-2739d0b00a20	760f1663a4f0845f1684c2d0fa8a02d745182871cc34bfa70fd8396579b2bb8f	2026-11-13 15:47:00.840301+00	\N	\N	2026-11-06 15:47:00.840302+00	::1
697d07c2-df7b-414f-847b-8456bcc2d04d	a343771d-bafb-4a55-9459-2739d0b00a20	80a434a603f0f351b1e165667a3ee65ea34798059ca21a07d65679667b4fc432	2026-11-13 15:48:13.476423+00	\N	\N	2026-11-06 15:48:13.476426+00	::1
181e7045-b7f1-4775-9382-ef0c147c0991	a343771d-bafb-4a55-9459-2739d0b00a20	1d5131f26b30bffb7a786e6de8964e15eb009b888694832f82d0419faca2ea72	2026-11-13 15:49:14.173074+00	\N	\N	2026-11-06 15:49:14.173076+00	::1
8ecc0e2b-e029-4894-8488-b6a673f154d6	a343771d-bafb-4a55-9459-2739d0b00a20	7b410f6e3c4b703823a019b451054e32cef5ebc826c54506cf731d90e30c0d73	2026-11-13 15:50:26.888445+00	\N	\N	2026-11-06 15:50:26.888446+00	::1
320e80ce-ab9c-4f55-9209-780f48b4c1e1	a343771d-bafb-4a55-9459-2739d0b00a20	e20d9a630401c8a6a205252336461ba57a1093df9ae36482bbb4870da9009f44	2026-11-13 15:52:19.408028+00	\N	\N	2026-11-06 15:52:19.408029+00	::1
c545c2fa-8f7c-499b-82e3-f77fa083a498	a343771d-bafb-4a55-9459-2739d0b00a20	62921f44fd12c37bb3367d77565eeebffb2dd682719f0842aaf2239abec9d632	2026-11-13 15:53:45.593257+00	\N	\N	2026-11-06 15:53:45.593259+00	::1
c4c770a1-98c2-49ea-9a00-46916613ac3a	ca98b73a-0982-4a3c-9834-a7df0fd609d3	71375c5396c96ec53a40e6899dda6ad1d8379cf89c24477215ea3579affaf693	2026-11-13 15:56:17.247459+00	2026-11-08 00:05:10.062044+00	5e94e2ddfa1087b89900e67bdfb1475f474fe2e83111823359c69157dde273ec	2026-11-06 15:56:17.247463+00	::1
ce9c29ed-d683-4c7d-b0a5-7351ee8e4d46	a343771d-bafb-4a55-9459-2739d0b00a20	4d9213fb994225ffa36647853171edb707f82aa721aed0111e1908a0ad634fba	2026-11-15 00:37:54.501368+00	\N	\N	2026-11-08 00:37:54.501422+00	::1
d8931d86-4e73-42f8-94e3-56ea1e31a232	a343771d-bafb-4a55-9459-2739d0b00a20	fa7856a45c591488fd925f0847b992826397a4d7a9a01fdef5bd2b3d0270a42e	2026-11-15 00:38:33.742447+00	\N	\N	2026-11-08 00:38:33.742448+00	::1
df897eec-17c8-428b-af84-172f392256fc	ca98b73a-0982-4a3c-9834-a7df0fd609d3	5e94e2ddfa1087b89900e67bdfb1475f474fe2e83111823359c69157dde273ec	2026-11-15 00:05:10.082917+00	2026-11-08 00:47:46.538701+00	02a31fcf59c8ac576a7237cde9fd98e9a1aa6772c610ccaf76d60997d3dacfea	2026-11-08 00:05:10.082921+00	::1
93a004e4-b143-4bf2-8d9e-3bc4e08fe0b2	ca98b73a-0982-4a3c-9834-a7df0fd609d3	02a31fcf59c8ac576a7237cde9fd98e9a1aa6772c610ccaf76d60997d3dacfea	2026-11-15 00:47:46.552397+00	2026-11-08 01:04:13.778836+00	49896c7fc8e89333943118a22f1f7ae9dc03f0830b7701dc2af45a01d1404e3e	2026-11-08 00:47:46.552404+00	::1
f7dc224b-644b-4e42-af33-bd46966adc2a	a343771d-bafb-4a55-9459-2739d0b00a20	9f3e3e03e280cbe98e9af11e4f9e54ae238067098ebd57813ee5a7c545cff267	2026-11-15 01:13:40.833176+00	\N	\N	2026-11-08 01:13:40.833177+00	::1
5db0de4e-68cf-40cb-a401-b1b705e24d71	a343771d-bafb-4a55-9459-2739d0b00a20	096fc539759a506ad05cb3a917dae33e32e570010840ac2adc7b0aeb5cdfe3d0	2026-11-15 01:14:22.306211+00	\N	\N	2026-11-08 01:14:22.306214+00	::1
93ea112f-ddd8-4510-ba7c-454ba38b06ef	ca98b73a-0982-4a3c-9834-a7df0fd609d3	49896c7fc8e89333943118a22f1f7ae9dc03f0830b7701dc2af45a01d1404e3e	2026-11-15 01:04:13.840123+00	2026-11-08 01:21:24.336152+00	6be00e5b9a599887ba1b55fefdb0736697d0b399e14ffd4e49ed57f89c71c8a4	2026-11-08 01:04:13.840128+00	::1
f1fc342b-efd6-4cb2-9139-ace04d9df715	ca98b73a-0982-4a3c-9834-a7df0fd609d3	6be00e5b9a599887ba1b55fefdb0736697d0b399e14ffd4e49ed57f89c71c8a4	2026-11-15 01:21:24.346821+00	2026-11-08 04:58:29.667025+00	b502defed7b7d6d8a49fc19cfb5c8e25500026e2a4ac990d52da28721696b77b	2026-11-08 01:21:24.346824+00	::1
904545b4-efbe-40e9-81f1-9283c8f5d76b	ca98b73a-0982-4a3c-9834-a7df0fd609d3	b502defed7b7d6d8a49fc19cfb5c8e25500026e2a4ac990d52da28721696b77b	2026-11-15 04:58:29.749794+00	2026-11-08 04:58:32.288719+00	\N	2026-11-08 04:58:29.749799+00	::1
3b90ca70-90d8-434c-b2b0-0101cc1648ee	a343771d-bafb-4a55-9459-2739d0b00a20	031b7e683935baa7eae30d869f021594412d21115a51a3b8b3406bb8172f7b86	2026-11-15 05:02:45.11409+00	\N	\N	2026-11-08 05:02:45.114109+00	::1
eadc041c-9a49-4b67-b02e-7f7f95ab4939	a343771d-bafb-4a55-9459-2739d0b00a20	0ce3f5e39bdae8e29a7c3b62dec98c8a10a6e739a36e29f84c0e86aadbe85702	2026-11-15 05:03:45.947678+00	\N	\N	2026-11-08 05:03:45.947685+00	::1
824f66ee-c19c-46fe-8c3f-ec8436aa1a10	70485f8d-a5b9-404a-af4e-22c437b5dc5a	d5d0c64241a71c6349f96a14c455ef04f75d8ae89c21494faf27d76bf2edd322	2026-11-15 04:59:50.651246+00	2026-11-08 05:10:27.101231+00	\N	2026-11-08 04:59:50.651248+00	::1
b4e06cc9-6614-4528-86e2-e2a916ae94b3	852cc4dc-913d-4d95-8962-4c5407d77d3c	3c89f8b3736552420b18c0d29e7fcc563568fc73409a2322603ebe6e061b2a00	2026-11-15 05:22:16.266229+00	\N	\N	2026-11-08 05:22:16.266251+00	::1
237d2c31-2b6d-434b-a73d-a5a00f7ca2fa	852cc4dc-913d-4d95-8962-4c5407d77d3c	3d2c01b69f3d98cd6728806d58c9b9bcbab448c2d9c5554d45854bf8879687c4	2026-11-15 05:23:17.475385+00	\N	\N	2026-11-08 05:23:17.475387+00	::1
e0b3575c-b23d-4be7-b880-983172968042	852cc4dc-913d-4d95-8962-4c5407d77d3c	e409a29961984ef0351bca990d9308bf9d0300a8419b0de2ec696ce2bb261b8f	2026-11-15 05:10:41.424601+00	2026-11-08 05:27:25.069297+00	f9baf28bbe054f478b6b67cf3e31511bd0c4847045ad0303cd6f1d372dfeb170	2026-11-08 05:10:41.424603+00	::1
94fc560c-810b-4352-8aad-25699bdb75d8	852cc4dc-913d-4d95-8962-4c5407d77d3c	f9baf28bbe054f478b6b67cf3e31511bd0c4847045ad0303cd6f1d372dfeb170	2026-11-15 05:27:25.077938+00	2026-11-08 05:27:27.386558+00	46d8198d28996f6b81ee129aeab8d62cc0b0dcd80a83d97cab7e0e0a09697112	2026-11-08 05:27:25.077943+00	::1
84dc6028-4e05-4626-8c95-82ce1db58931	852cc4dc-913d-4d95-8962-4c5407d77d3c	d5ea3d065be906d52047b6f96aca4a62a4cf85423debf993509d1011313505de	2026-11-15 05:34:40.888222+00	\N	\N	2026-11-08 05:34:40.888504+00	::1
9dbd30cf-e704-45e4-aca4-cd5e7157c14d	852cc4dc-913d-4d95-8962-4c5407d77d3c	bc58565765c6d74509c4acea963259e8cc471e0fddd541df4f5fc5a74ac8ca3b	2026-11-15 05:37:58.355334+00	\N	\N	2026-11-08 05:37:58.355349+00	::1
488ed31f-7b2b-4aea-b761-fbc5bd9d244e	852cc4dc-913d-4d95-8962-4c5407d77d3c	46d8198d28996f6b81ee129aeab8d62cc0b0dcd80a83d97cab7e0e0a09697112	2026-11-15 05:27:27.396493+00	2026-11-08 05:41:35.481305+00	\N	2026-11-08 05:27:27.396499+00	::1
4528a55b-adb9-4eff-b89a-cf4c6ef01270	852cc4dc-913d-4d95-8962-4c5407d77d3c	753fe925085f44fcd392e4dd28be896dbf11e9f106f2c4205c942afb31c3881e	2026-11-15 05:44:59.823804+00	2026-11-08 05:59:59.970563+00	ad23b431bb7225fb1efd904a2b557f9304c323eed4402a29caa826ed10ab9ae9	2026-11-08 05:44:59.823837+00	::1
45d98e37-97f0-4068-a1a3-172414d495e5	852cc4dc-913d-4d95-8962-4c5407d77d3c	4bad01c020c53f2dab1de55142eaa2a372bc83192821a2912b324d8d891bb8be	2026-11-15 06:06:25.961966+00	\N	\N	2026-11-08 06:06:25.961967+00	::1
1ba27f78-f145-4afb-b16a-e0963b7eb916	852cc4dc-913d-4d95-8962-4c5407d77d3c	9c17d3839fd41f6f95b037cd1a1ae691d80ac6ba19b01f5e5e24994f8727794b	2026-11-15 06:07:50.352934+00	\N	\N	2026-11-08 06:07:50.352936+00	::1
2d6cc3c0-5bed-4732-b85d-4dc9e563dfd5	852cc4dc-913d-4d95-8962-4c5407d77d3c	99b8986d2292d67b010f4bce6a8eb5b033bbb7a1b42580c1813b00e46e006bed	2026-11-15 06:08:35.328664+00	\N	\N	2026-11-08 06:08:35.328666+00	::1
866ecc93-cdc7-4476-a0ce-236d7259230d	852cc4dc-913d-4d95-8962-4c5407d77d3c	ad23b431bb7225fb1efd904a2b557f9304c323eed4402a29caa826ed10ab9ae9	2026-11-15 05:59:59.978483+00	2026-11-08 06:21:21.374892+00	ca87c88a11b02ca42f10fb362ad27f23e29c58de04d0b63ed0991c8edf753fea	2026-11-08 05:59:59.978486+00	::1
0506c2bf-9317-4e72-9d15-a2454a9ec4e1	852cc4dc-913d-4d95-8962-4c5407d77d3c	f4d0ca2b53c71716c164c4c1b5c0b0682b8350476993b0cd25085282ca0907be	2026-11-15 06:13:14.157143+00	\N	\N	2026-11-08 06:13:14.157145+00	::1
ee325914-1a1b-46b9-a038-c628186f422d	852cc4dc-913d-4d95-8962-4c5407d77d3c	36407a1921b725f2b0f33a47bc1c985085c92b228eb6e4d5923824f473bd156a	2026-11-15 06:15:35.229543+00	\N	\N	2026-11-08 06:15:35.229545+00	::1
afdd0fd7-6703-4189-b789-6335af40dda2	852cc4dc-913d-4d95-8962-4c5407d77d3c	d8f7d84d56a235ef182cdf1428a4cb74be69d7941271219686b1c9d09ee26d6f	2026-11-15 06:19:19.151705+00	\N	\N	2026-11-08 06:19:19.151707+00	::1
58ad95a7-5d9a-499a-b47f-cc74ceb74624	852cc4dc-913d-4d95-8962-4c5407d77d3c	9472d8e18e85721da6d86db745aea6a386be2d2717c432b3f5784698e3054d28	2026-11-15 06:19:51.703476+00	\N	\N	2026-11-08 06:19:51.703479+00	::1
4f12142c-2207-4af6-9183-96429dc5b6b9	852cc4dc-913d-4d95-8962-4c5407d77d3c	b778446775fb439b8820b6215b95872d742dbc58c593d4174a283f4654e389f9	2026-11-15 06:28:15.916354+00	\N	\N	2026-11-08 06:28:15.91644+00	::1
4988880e-6238-41e8-bc4c-1f59036a0e9a	852cc4dc-913d-4d95-8962-4c5407d77d3c	ca87c88a11b02ca42f10fb362ad27f23e29c58de04d0b63ed0991c8edf753fea	2026-11-15 06:21:21.379288+00	2026-11-08 06:46:45.646917+00	d1779d0b4ed6a76205ede6f8c3ceec5cce9aa78309e8fb1ffb0b82cfc25ffade	2026-11-08 06:21:21.379293+00	::1
7762c8e9-8f5f-4c97-a62e-6fef97d609fb	852cc4dc-913d-4d95-8962-4c5407d77d3c	d1779d0b4ed6a76205ede6f8c3ceec5cce9aa78309e8fb1ffb0b82cfc25ffade	2026-11-15 06:46:45.682512+00	2026-11-08 06:51:55.401526+00	\N	2026-11-08 06:46:45.682521+00	::1
3e184042-1fc7-4d85-8fe9-c975b222c0f4	852cc4dc-913d-4d95-8962-4c5407d77d3c	e5bb386f327df828c715882232ded12c6491e80b460178b707ac6f4b2733b264	2026-11-15 06:52:40.894607+00	2026-11-08 07:02:25.585818+00	\N	2026-11-08 06:52:40.89461+00	::1
76ab8952-38c2-474b-9003-9c30a820f0ed	852cc4dc-913d-4d95-8962-4c5407d77d3c	40cd364c4ce107c6affeeac8540f870d564cc3b67c16e3e6b74964df284c1a7a	2026-11-15 07:18:05.637641+00	\N	\N	2026-11-08 07:18:05.637643+00	::1
932470be-8f75-49e2-a987-93fd3bf08be1	852cc4dc-913d-4d95-8962-4c5407d77d3c	376e8a790641b15b8707a89d26f05cd22de33a8baaf37bd80543ab2b444f34f7	2026-11-15 07:12:37.087723+00	2026-11-09 08:21:29.271245+00	227a021a6bf1f1a787e21472cac035c5e828f1bdb5acccf89eefda7afe0c4c60	2026-11-08 07:12:37.087807+00	::1
3b29e9d2-8c19-4d60-97b6-b00ace90ec3b	852cc4dc-913d-4d95-8962-4c5407d77d3c	227a021a6bf1f1a787e21472cac035c5e828f1bdb5acccf89eefda7afe0c4c60	2026-11-16 08:21:29.422978+00	2026-11-09 08:22:05.105155+00	59e9d23f43835be77cdde9ce517a2216acf2e1ce22879258d9d7ba1f83f799bc	2026-11-09 08:21:29.422983+00	::1
da28e02f-ffd0-4519-abd4-a08e035de446	852cc4dc-913d-4d95-8962-4c5407d77d3c	59e9d23f43835be77cdde9ce517a2216acf2e1ce22879258d9d7ba1f83f799bc	2026-11-16 08:22:05.115512+00	2026-11-09 08:59:10.243992+00	ad69b1bdd6ddd21ab04bf3e8ec111c1d0cc3f116528160a333ff9e2fcc813a5c	2026-11-09 08:22:05.115517+00	::1
a38b2750-0367-4f8c-8a9e-fc45d97c60d6	852cc4dc-913d-4d95-8962-4c5407d77d3c	ad69b1bdd6ddd21ab04bf3e8ec111c1d0cc3f116528160a333ff9e2fcc813a5c	2026-11-16 08:59:10.255123+00	2026-11-09 09:46:59.636797+00	12cee6d01846af329d0e179c74fc715d980f668cfaf06918c12b400f106f909a	2026-11-09 08:59:10.25514+00	::1
b900fbe3-350b-47f4-829c-24aa9c437ddc	852cc4dc-913d-4d95-8962-4c5407d77d3c	12cee6d01846af329d0e179c74fc715d980f668cfaf06918c12b400f106f909a	2026-11-16 09:46:59.784799+00	2026-11-09 09:47:06.793011+00	e98b4084fc834468e6918fb3d644cbf5bfd0b8a2532ca382157495bce1c5071a	2026-11-09 09:46:59.784812+00	::1
42978279-0eaf-4373-8c88-c4cf659413cd	852cc4dc-913d-4d95-8962-4c5407d77d3c	e98b4084fc834468e6918fb3d644cbf5bfd0b8a2532ca382157495bce1c5071a	2026-11-16 09:47:06.803197+00	2026-11-09 09:47:47.407178+00	33c2205df111fe8d194f06628ed604821102475becaa8f8498626a2f436f68c6	2026-11-09 09:47:06.803202+00	::1
99a9f910-35c6-4cde-a356-9861c29f1e11	852cc4dc-913d-4d95-8962-4c5407d77d3c	33c2205df111fe8d194f06628ed604821102475becaa8f8498626a2f436f68c6	2026-11-16 09:47:47.416499+00	2026-11-09 09:48:04.626763+00	556ea1e2cf0518019d1510f650b50da6c359acd719c68d176ac0ed3eb6d495d1	2026-11-09 09:47:47.416505+00	::1
f98249fd-46b8-4f90-a579-41b02ec224bc	852cc4dc-913d-4d95-8962-4c5407d77d3c	556ea1e2cf0518019d1510f650b50da6c359acd719c68d176ac0ed3eb6d495d1	2026-11-16 09:48:04.635001+00	2026-11-09 10:05:38.335263+00	605efb27f2dc2e6ad5cd06007a41198fb4a3830afc2bbbbeb0434df4acf062be	2026-11-09 09:48:04.635006+00	::1
8781132e-4150-42ef-8b32-efaa8f3dbe3f	852cc4dc-913d-4d95-8962-4c5407d77d3c	605efb27f2dc2e6ad5cd06007a41198fb4a3830afc2bbbbeb0434df4acf062be	2026-11-16 10:05:38.345257+00	2026-11-09 13:57:59.546948+00	7ac7a2e3208961674b50206b5ad08d6e13ee3fcddaf4ffe2032b2f6f04c0fdcc	2026-11-09 10:05:38.345264+00	::1
799e17a9-4e11-452e-83db-6f64256ebda8	852cc4dc-913d-4d95-8962-4c5407d77d3c	7ac7a2e3208961674b50206b5ad08d6e13ee3fcddaf4ffe2032b2f6f04c0fdcc	2026-11-16 13:57:59.684194+00	2026-11-09 13:59:01.060192+00	6f859a66f3b0673878a45790b4b75f1ec0de0077de8d246dbc3b8bad9afe0ab9	2026-11-09 13:57:59.684198+00	::1
14c27299-26ed-4267-8fb0-9c9b45c47cd9	852cc4dc-913d-4d95-8962-4c5407d77d3c	6f859a66f3b0673878a45790b4b75f1ec0de0077de8d246dbc3b8bad9afe0ab9	2026-11-16 13:59:01.066945+00	2026-11-09 14:00:11.02812+00	\N	2026-11-09 13:59:01.066951+00	::1
3d193cc6-238f-432d-ad74-438c91c23c1c	ca98b73a-0982-4a3c-9834-a7df0fd609d3	e79685413fdbcb564f2f09253d7971c5ddc21bccc3e85bd0c5c7f2d4578b5712	2026-11-16 14:00:20.593109+00	2026-11-09 14:01:09.092919+00	ba7e2fcb70ec7da0e672bfc887ff91759a8b428247ad8694b8586a31051b5437	2026-11-09 14:00:20.59311+00	::1
f06bbde9-c0ac-461a-b682-b8a85c09219f	ca98b73a-0982-4a3c-9834-a7df0fd609d3	ba7e2fcb70ec7da0e672bfc887ff91759a8b428247ad8694b8586a31051b5437	2026-11-16 14:01:09.098732+00	2026-11-09 14:01:33.682747+00	\N	2026-11-09 14:01:09.098745+00	::1
8d92c167-3469-4e1b-b689-6b19628bb7bc	852cc4dc-913d-4d95-8962-4c5407d77d3c	7af7b5df0770662e2ebef88d94a85e0abaaeb3f1eee377a76c374ed68a1f2719	2026-11-16 14:01:46.621735+00	2026-11-09 14:28:15.520974+00	a22a3ffd5649ee66de460ed1be782601c409ba1ad08d4adc229bb09db3dce197	2026-11-09 14:01:46.621737+00	::1
2761cdfe-229a-41c6-8ad4-7605553e5fcd	852cc4dc-913d-4d95-8962-4c5407d77d3c	a22a3ffd5649ee66de460ed1be782601c409ba1ad08d4adc229bb09db3dce197	2026-11-16 14:28:15.555925+00	2026-11-09 14:33:34.335597+00	bf67db489697b3f9275441fdcc765e8a3977ee6d5b0ae2750445499dbfd30d58	2026-11-09 14:28:15.55606+00	::1
68c8b2b3-00c2-4539-b936-2c976562296a	852cc4dc-913d-4d95-8962-4c5407d77d3c	bf67db489697b3f9275441fdcc765e8a3977ee6d5b0ae2750445499dbfd30d58	2026-11-16 14:33:34.455718+00	2026-11-09 14:33:40.149329+00	\N	2026-11-09 14:33:34.455723+00	::1
a223b74d-3867-464a-85b7-5a68caec1cc1	ca98b73a-0982-4a3c-9834-a7df0fd609d3	b9dc51cb982d33d5d09cc8fcdee30aeeea9c65727979869937d3ac2f3c395c4d	2026-11-16 14:34:03.969824+00	2026-11-09 14:49:20.387239+00	\N	2026-11-09 14:34:03.969827+00	::1
0d1dd4e3-4293-4565-9ea1-8152ce0c008f	852cc4dc-913d-4d95-8962-4c5407d77d3c	a3b131f58458b2f5091c9a5b7c613eb24ca573b1fbc3423ea97930a3577389c3	2026-11-16 14:49:42.126169+00	2026-11-09 15:03:53.148972+00	26c6ffb58ff362a1061badf0e4eb11e881a09d274421d5db198672caf9419be9	2026-11-09 14:49:42.126171+00	::1
53261739-e474-4d73-a803-7afe15d326b4	852cc4dc-913d-4d95-8962-4c5407d77d3c	26c6ffb58ff362a1061badf0e4eb11e881a09d274421d5db198672caf9419be9	2026-11-16 15:03:53.17879+00	2026-11-09 15:09:22.899444+00	ea32ac21c5cbae00728a7314638d5d27aa6099dd321278792dcc635f601cdc1f	2026-11-09 15:03:53.178799+00	::1
726b5072-26ce-4361-a86c-dece15b8a05f	852cc4dc-913d-4d95-8962-4c5407d77d3c	ea32ac21c5cbae00728a7314638d5d27aa6099dd321278792dcc635f601cdc1f	2026-11-16 15:09:22.982284+00	2026-11-09 15:18:31.487149+00	8ab3836a39804986cdd808ca8ac26260254210b3ab0bfbe7d8069397937610b6	2026-11-09 15:09:22.982289+00	::1
2f60f49c-8a0d-47e1-8626-40dfcb083d48	852cc4dc-913d-4d95-8962-4c5407d77d3c	8ab3836a39804986cdd808ca8ac26260254210b3ab0bfbe7d8069397937610b6	2026-11-16 15:18:31.505051+00	2026-11-09 15:18:44.161181+00	a92470dc944b7100cbfc327d58e87aeceb1477cac1b02f2b9230df496fd59719	2026-11-09 15:18:31.505056+00	::1
72b718a5-432f-472c-a055-273a9e20f159	852cc4dc-913d-4d95-8962-4c5407d77d3c	a92470dc944b7100cbfc327d58e87aeceb1477cac1b02f2b9230df496fd59719	2026-11-16 15:18:44.16684+00	2026-11-09 15:18:46.317912+00	\N	2026-11-09 15:18:44.166848+00	::1
cb68184b-9dc4-4a32-b2ee-e61f3a804edb	852cc4dc-913d-4d95-8962-4c5407d77d3c	b4e43774dbb65509d86400e68d386760f7044f8ed3302740b32b3542dc48671e	2026-11-17 04:39:05.702241+00	2026-11-10 04:40:32.101205+00	\N	2026-11-10 04:39:05.702331+00	::1
73b8456a-bf43-4797-881d-e7ba24a50f00	a343771d-bafb-4a55-9459-2739d0b00a20	e4cbc7c062948592c0e4ffb5f3291341b91ff9ac364f16e09eb6c32b4169b6f2	2026-11-17 05:03:08.149295+00	\N	\N	2026-11-10 05:03:08.149383+00	::1
bedf4c13-11ad-45f4-927e-4c12089c9b65	852cc4dc-913d-4d95-8962-4c5407d77d3c	060cfa4b326f5cec7a32afa89343cef4295a8ba62b8fa039b169de09a67f6012	2026-11-17 05:03:08.603855+00	\N	\N	2026-11-10 05:03:08.603857+00	::1
ab9fa5da-5f4b-4836-9dc4-49a81b009b27	603ccb4d-7433-4df4-883a-e5c9aa132928	2b4ff416696ca55971a8673ed1a001c68afc406603cfe51c06d5d46538196777	2026-11-17 05:03:37.493227+00	\N	\N	2026-11-10 05:03:37.493229+00	::1
687813bc-3e1d-41c6-8693-0e032de953c5	e301ed09-eb9c-4060-a36b-ed3b18e1ccc8	28215a540b529130b7a652a9b60c0e8a43759e053c1900a463a0beb0407b4fed	2026-11-17 05:03:47.329837+00	\N	\N	2026-11-10 05:03:47.329828+00	::1
b2022546-4072-4706-9147-36ce93c68b29	ca98b73a-0982-4a3c-9834-a7df0fd609d3	ae8c6d8910fbb4ac3ccad353088bec924af2b8c746a74e74d237ef274b71da9f	2026-11-17 04:40:44.382491+00	2026-11-10 05:03:48.57786+00	15610bbf3d1463872a2252d523bf3569f009827a892678836a4791714d480c64	2026-11-10 04:40:44.382492+00	::1
d74b0fbe-31c4-4e6e-bd1b-f6a47d2ab26c	a343771d-bafb-4a55-9459-2739d0b00a20	8c9777caa56c404e992c99dec2b564ce33bec1a28a25a844ecc8bf672272c30a	2026-11-17 05:15:52.834031+00	\N	\N	2026-11-10 05:15:52.834114+00	::1
7d44ee07-f21e-480d-93e2-6ed707ca6450	852cc4dc-913d-4d95-8962-4c5407d77d3c	be0e77afdb4be7960b84c1dd63666e19b7360002f733abdeaeb03caa31af45af	2026-11-17 05:15:53.242044+00	\N	\N	2026-11-10 05:15:53.242044+00	::1
f9c57606-fd9f-4414-9ce4-b5d89cfe2ab0	ca98b73a-0982-4a3c-9834-a7df0fd609d3	15610bbf3d1463872a2252d523bf3569f009827a892678836a4791714d480c64	2026-11-17 05:03:48.587358+00	2026-11-10 05:53:58.467102+00	7e4c1da20a9d16a2fc0dfe0395bf0be50403faf94e19dc2f2a2cb3c1872f5a5c	2026-11-10 05:03:48.587365+00	::1
274620c3-4b13-4a02-9dfd-7b57801df3c5	ca98b73a-0982-4a3c-9834-a7df0fd609d3	7e4c1da20a9d16a2fc0dfe0395bf0be50403faf94e19dc2f2a2cb3c1872f5a5c	2026-11-17 05:53:58.480724+00	2026-11-11 12:30:36.00128+00	1c195fb0dcd559cfc4d182751c2b6270e8d79d2f28556ee143250e63cf37cf9f	2026-11-10 05:53:58.480728+00	::1
5fbfef32-358a-4981-86f5-32145bb3ece0	ca98b73a-0982-4a3c-9834-a7df0fd609d3	1c195fb0dcd559cfc4d182751c2b6270e8d79d2f28556ee143250e63cf37cf9f	2026-11-18 12:30:36.102482+00	2026-11-11 12:31:30.521759+00	\N	2026-11-11 12:30:36.102486+00	::1
9fd31ec2-8fae-420a-a49d-332f5bdec859	852cc4dc-913d-4d95-8962-4c5407d77d3c	dd31bf1cbb5e6d5f4820612fa76f75cadbb48c5e54369f584504a81d7a4ebf0e	2026-11-18 12:31:43.224523+00	2026-11-11 12:50:44.413242+00	5585fa7b97204c5a58c45f8aed33fbd93bb688a6aed43fb5113026160ee3c32a	2026-11-11 12:31:43.224524+00	::1
a285749a-a2ca-4936-84fb-454cf421f4cb	852cc4dc-913d-4d95-8962-4c5407d77d3c	5585fa7b97204c5a58c45f8aed33fbd93bb688a6aed43fb5113026160ee3c32a	2026-11-18 12:50:44.437846+00	2026-11-11 13:17:23.849701+00	a92cec1d09dc018f224d633db449de705386d5d262f5558edcc6d264be81298d	2026-11-11 12:50:44.43785+00	::1
71c1dc31-0c3e-4341-a7f1-b991cbcfa806	852cc4dc-913d-4d95-8962-4c5407d77d3c	a92cec1d09dc018f224d633db449de705386d5d262f5558edcc6d264be81298d	2026-11-18 13:17:23.915323+00	2026-11-11 14:33:18.065395+00	d42c5b2fb72f878dc04430732e4942466fce81ae95e778baee1e4c3b8cba3163	2026-11-11 13:17:23.915326+00	::1
05c70fb7-5ae4-40c3-aefd-4eea8dfe8f8d	852cc4dc-913d-4d95-8962-4c5407d77d3c	d42c5b2fb72f878dc04430732e4942466fce81ae95e778baee1e4c3b8cba3163	2026-11-18 14:33:18.162466+00	2026-11-11 14:41:55.0062+00	941fbb9c0e1ecb4e50b283e3a534b9d407c7bedb33788552fd43ec7a5e4b0b87	2026-11-11 14:33:18.162475+00	::1
54cd98d3-a2e0-493f-93c3-11742f7b7294	852cc4dc-913d-4d95-8962-4c5407d77d3c	941fbb9c0e1ecb4e50b283e3a534b9d407c7bedb33788552fd43ec7a5e4b0b87	2026-11-18 14:41:55.014382+00	2026-11-11 14:51:34.771094+00	53093664e9973b3f9d1df579569eccc11ecda4e4dc8d3c1e53526321f5b3a7a2	2026-11-11 14:41:55.014387+00	::1
c183c6b7-1a9e-4d43-b829-d8876bf4ea7b	852cc4dc-913d-4d95-8962-4c5407d77d3c	53093664e9973b3f9d1df579569eccc11ecda4e4dc8d3c1e53526321f5b3a7a2	2026-11-18 14:51:34.864783+00	2026-11-11 14:56:23.515278+00	6648fb3f22dcd1578eea909774d8ddf7f51b31ce48b53a2626cafdd7dae05f2c	2026-11-11 14:51:34.864787+00	::1
f03eaf1a-3148-400d-b9b4-8376e16636bd	852cc4dc-913d-4d95-8962-4c5407d77d3c	6648fb3f22dcd1578eea909774d8ddf7f51b31ce48b53a2626cafdd7dae05f2c	2026-11-18 14:56:23.623262+00	2026-11-11 14:58:02.58939+00	efe8efb9c3f7e213b0a096c50c1ac58f55e24658f01b3d1e3b42fffdf5bb47f0	2026-11-11 14:56:23.623268+00	::1
cc79debe-36df-4bd2-82a8-f5cd780fb809	852cc4dc-913d-4d95-8962-4c5407d77d3c	efe8efb9c3f7e213b0a096c50c1ac58f55e24658f01b3d1e3b42fffdf5bb47f0	2026-11-18 14:58:02.593784+00	2026-11-11 14:58:05.05357+00	d9244303ccdf80777972d08a6e00c461419f78781d74b16e501e9161bf6337d4	2026-11-11 14:58:02.593789+00	::1
ca5c2074-a179-4ccc-800b-2823566f3f10	852cc4dc-913d-4d95-8962-4c5407d77d3c	d9244303ccdf80777972d08a6e00c461419f78781d74b16e501e9161bf6337d4	2026-11-18 14:58:05.05723+00	2026-11-11 14:58:10.137351+00	97c6c518b75a8b35a482513f10259860a840ad4d083a4973ea67ac99d4ef072f	2026-11-11 14:58:05.057233+00	::1
53a48856-bf8c-4052-a722-72cc2b60799c	852cc4dc-913d-4d95-8962-4c5407d77d3c	97c6c518b75a8b35a482513f10259860a840ad4d083a4973ea67ac99d4ef072f	2026-11-18 14:58:10.146382+00	2026-11-11 14:58:17.341818+00	d6c1887102ed8cee3828dd5446eb69939a893ef1cc11c71ea777f46ae0632613	2026-11-11 14:58:10.146387+00	::1
96a1c485-9df6-4774-8552-c95519478fc6	852cc4dc-913d-4d95-8962-4c5407d77d3c	d6c1887102ed8cee3828dd5446eb69939a893ef1cc11c71ea777f46ae0632613	2026-11-18 14:58:17.34702+00	\N	\N	2026-11-11 14:58:17.347025+00	::1
3f326019-eef4-44d8-aa69-ff802ebd4664	a343771d-bafb-4a55-9459-2739d0b00a20	73ce8d7f3f54dfaf029f98c7c39e128a957cd6f7d0446f04e586e6e2ffe0d84f	2026-11-18 15:12:57.259128+00	\N	\N	2026-11-11 15:12:57.259131+00	::1
8fb3a0d2-447d-4b61-8f69-dfc5beafcc97	a343771d-bafb-4a55-9459-2739d0b00a20	78e7d26214b59fd84931b725b634eea8527dd7a3d05c03575b1e954840677e9e	2026-11-18 15:13:56.378276+00	\N	\N	2026-11-11 15:13:56.378278+00	::1
2f4fb2dc-38e5-4d9f-93f9-08b29710cdf5	a343771d-bafb-4a55-9459-2739d0b00a20	9465531fd178525e00db482c7b49593835ddfc13e6666f7dd912b5d84bc5030a	2026-11-27 08:13:25.15253+00	\N	\N	2026-11-20 08:13:25.152614+00	::1
6fe72356-085a-46e8-aa77-5cf5e1e69bf5	852cc4dc-913d-4d95-8962-4c5407d77d3c	34794f10ee3fd1ba20472bbcaf724e74cc4c79c42723ea7ad62e13bb2ee179fa	2026-11-27 09:12:58.658935+00	2026-11-20 10:16:50.693213+00	65ade434368d1fb5b9c0d5c5d9a9209a9be7b3b9128ed840d47d689da63f7026	2026-11-20 09:12:58.658938+00	::1
655b0976-54e6-4420-bc93-ddbbad7b1f59	852cc4dc-913d-4d95-8962-4c5407d77d3c	65ade434368d1fb5b9c0d5c5d9a9209a9be7b3b9128ed840d47d689da63f7026	2026-11-27 10:16:50.805383+00	2026-11-20 10:18:19.584996+00	\N	2026-11-20 10:16:50.805388+00	::1
7989dbeb-0911-457e-9c5d-c7f0abee799e	852cc4dc-913d-4d95-8962-4c5407d77d3c	1b42540529b729c2d47f7771122ad0034395f67241dfed87d558b436c8b8aca7	2026-11-27 10:31:08.15684+00	\N	\N	2026-11-20 10:31:08.156842+00	::1
0b301ccb-99d4-423d-9f2e-c6d8b0652df1	852cc4dc-913d-4d95-8962-4c5407d77d3c	abc66f2fff65be3f4caecc6030fd06218503804a3b172580e3911392050b7ea4	2026-11-27 10:40:31.461748+00	\N	\N	2026-11-20 10:40:31.461749+00	::1
20238125-f1b7-4b06-9444-52cdf6b77e52	852cc4dc-913d-4d95-8962-4c5407d77d3c	619b22cbf02d620e620fcaad3b801ab692c9687c5259320ea73ffa34c29cb6ca	2026-11-27 10:46:20.075922+00	\N	\N	2026-11-20 10:46:20.076007+00	::1
e2b06aba-6fe2-439f-b1c5-a80d6d1e6e43	ca98b73a-0982-4a3c-9834-a7df0fd609d3	512f9ccf089d5fa4f915032b82a42a0f8f26b3b9a97507ba6316c15d8fc4b131	2026-11-27 10:18:32.250962+00	2026-11-20 11:44:20.225953+00	2e3703cf61407f39f07b0787210ab21c4018af94ec389a3542c9a0d3fbd7bc07	2026-11-20 10:18:32.250965+00	::1
9fe05a59-fbb0-4c99-946c-af2f2cf756be	852cc4dc-913d-4d95-8962-4c5407d77d3c	632da921c0b3472077213632c90e4fad6709fa9785e61b6c73e5be693d1c0e51	2026-11-27 10:47:03.130663+00	\N	\N	2026-11-20 10:47:03.130664+00	::1
183fe53e-8739-4e47-a9a2-28ad79c1ffdf	852cc4dc-913d-4d95-8962-4c5407d77d3c	2d8a52bf2a93af88bc861003eb83ac54228f72790cb2095baf35d0d0c2411564	2026-11-27 10:48:56.682074+00	\N	\N	2026-11-20 10:48:56.682074+00	::1
565282c0-6e1d-494f-9817-056e2ffb77e8	852cc4dc-913d-4d95-8962-4c5407d77d3c	fa8851086b97aa46ba42eeb020bccb2440db6cbdccb2d31881502349cd42d3ab	2026-11-27 11:06:02.161218+00	\N	\N	2026-11-20 11:06:02.161308+00	::1
35aa0237-4ddd-449d-9602-1cf23f1ce406	603ccb4d-7433-4df4-883a-e5c9aa132928	618f30f4ca561f7327164bba23360fc16e0c72b0b72a381b8ad293c090405600	2026-11-27 11:06:02.307736+00	\N	\N	2026-11-20 11:06:02.307738+00	::1
67263936-a249-4715-8b5c-25ec43abb24c	852cc4dc-913d-4d95-8962-4c5407d77d3c	8b13e89eb00fe0fa371bfddaa0a7088e882f75f8187efedc35c792193b955881	2026-11-27 11:07:21.387079+00	\N	\N	2026-11-20 11:07:21.387083+00	::1
d1b8ecb9-97b3-46cf-aa81-72a5a6419791	603ccb4d-7433-4df4-883a-e5c9aa132928	647be387c05057eddde844453586680263f6046bed7cb47bc385058a57c8d126	2026-11-27 11:07:21.471984+00	\N	\N	2026-11-20 11:07:21.471985+00	::1
a6a11b00-5e13-4923-8de9-cb7aadb2b152	852cc4dc-913d-4d95-8962-4c5407d77d3c	ac01712ae6709716a9d671e7926eefa038a4eb4b5b5762e9330b92c8cd1e7963	2026-11-27 11:08:12.178603+00	\N	\N	2026-11-20 11:08:12.178604+00	::1
4d53b14c-0dcb-4473-9f30-af6c2b93f62a	603ccb4d-7433-4df4-883a-e5c9aa132928	19c20040cd633587c58dbda5a0744c2e449ec533242d39ea7afaf779eff7a9f2	2026-11-27 11:08:12.264905+00	\N	\N	2026-11-20 11:08:12.264907+00	::1
c584f883-941b-4769-990d-abdfe5f727b8	852cc4dc-913d-4d95-8962-4c5407d77d3c	b9cc055119986666e44a4baa3990fb37b63198c7f50f09d6e8dba3abbd926e08	2026-11-27 11:09:45.982595+00	\N	\N	2026-11-20 11:09:45.982596+00	::1
8d5e723d-542b-428a-9b1a-33a08362e76c	603ccb4d-7433-4df4-883a-e5c9aa132928	0d53c5bca5111a12bd3490dedff80d9b2fff0efc11ac638820701c177fd4b378	2026-11-27 11:09:46.056231+00	\N	\N	2026-11-20 11:09:46.056232+00	::1
06ecf3c0-b643-4c62-bef8-c990610b0729	852cc4dc-913d-4d95-8962-4c5407d77d3c	2f1b86f73dc0bedb87f5745f50121fbbfb1aeb248a371d017dc2e10910908f24	2026-11-27 11:11:41.77063+00	\N	\N	2026-11-20 11:11:41.770631+00	::1
63845c79-9372-4537-9fd5-e95bafaabf7d	603ccb4d-7433-4df4-883a-e5c9aa132928	dc9042a5a38fed00d72f433c24e8db23a0442ff637324f860883e797ad99939f	2026-11-27 11:11:41.836161+00	\N	\N	2026-11-20 11:11:41.836162+00	::1
b2009c5e-8135-45e6-bfe4-87cc96428242	852cc4dc-913d-4d95-8962-4c5407d77d3c	67c9ffaea37d223e284446d3bdb13a4c15463605ef83603bb803d5b3759858cb	2026-11-27 11:12:11.198289+00	\N	\N	2026-11-20 11:12:11.19829+00	::1
c9a10bb6-e2ec-483e-b68f-cc075cadc44b	603ccb4d-7433-4df4-883a-e5c9aa132928	1dd910b142bdbf396a6037f51cdc9e3e043f61dbf6fdf826e0c54a07bd970dd2	2026-11-27 11:12:11.263565+00	\N	\N	2026-11-20 11:12:11.263566+00	::1
bfed7c92-2555-4a19-aabc-258723c96810	852cc4dc-913d-4d95-8962-4c5407d77d3c	24bea1a4923c5d643a46a7e14960e238da1594fe7b9452ba731d94ac8701679e	2026-11-27 11:12:42.432162+00	\N	\N	2026-11-20 11:12:42.432164+00	::1
56d76e80-6092-4c89-9b83-194a2b34c007	603ccb4d-7433-4df4-883a-e5c9aa132928	2864c15e8bc07f811aecd5cbe2b6610b17cf71f79afb497ebdb2135a6a1273cc	2026-11-27 11:12:42.506565+00	\N	\N	2026-11-20 11:12:42.506567+00	::1
11ccf1bd-be16-406d-8c21-6eb063a64979	603ccb4d-7433-4df4-883a-e5c9aa132928	5b1a99b92a39053df2b90ef6a42730c54dbe2ea7aa5f4c7504f7ff422e1709a5	2026-11-27 11:32:00.525965+00	\N	\N	2026-11-20 11:32:00.526049+00	::1
cc9f5614-84e3-46be-a798-8e11cc232207	603ccb4d-7433-4df4-883a-e5c9aa132928	e5976138819c1fcb2ce596f44dfc0ccebca4d4fa7ddb4d43ef3980d5b60d8b5f	2026-11-27 11:32:40.964535+00	\N	\N	2026-11-20 11:32:40.964536+00	::1
33bb4504-3600-4c05-814c-2294f1a2ac81	603ccb4d-7433-4df4-883a-e5c9aa132928	75d5b1c58ccc78d3a8c8c42f22afaf3cb02a72a46d6c899ef631ba4e8606ec0d	2026-11-27 11:32:56.005318+00	\N	\N	2026-11-20 11:32:56.005319+00	::1
87dc13e3-9f50-4e55-85e1-cdf630b3b900	852cc4dc-913d-4d95-8962-4c5407d77d3c	50f65004968d8e19309ffa091ae94bdc22f12b4864cc29268b87f3be23727e64	2026-11-27 11:34:36.985495+00	\N	\N	2026-11-20 11:34:36.985496+00	::1
6a6067eb-44ca-4918-838f-424cdde0efdf	603ccb4d-7433-4df4-883a-e5c9aa132928	abd275a33eaeeaa00ef0db5aab4c14e02d9214c947f4d12ea603a708204c5976	2026-11-27 11:34:37.053796+00	\N	\N	2026-11-20 11:34:37.053798+00	::1
6c14059f-9b57-4958-a87a-48ab5b12744a	852cc4dc-913d-4d95-8962-4c5407d77d3c	3e4544fdd6d3e31b7b8aee391db4b9d336810c1b6d159cb16f58938e18c76c1c	2026-11-27 11:39:24.781667+00	\N	\N	2026-11-20 11:39:24.78175+00	::1
66da3779-9c1f-4feb-9514-a7e377f03a84	603ccb4d-7433-4df4-883a-e5c9aa132928	036a85697dfbd83a0e69c9a11732afc26709407071751bed39fe9069ac360f88	2026-11-27 11:39:24.981099+00	\N	\N	2026-11-20 11:39:24.9811+00	::1
8d58dcd9-34ed-4fe5-978f-1e463741710a	852cc4dc-913d-4d95-8962-4c5407d77d3c	6a487be605e84d1cdb164e343e1cfb031f09cf5b6e6efc2a0af8f88ceb435fb3	2026-11-27 12:07:03.860073+00	\N	\N	2026-11-20 12:07:03.860075+00	::1
01d8492e-af1c-448a-974d-8bc0f94c87d0	ca98b73a-0982-4a3c-9834-a7df0fd609d3	2e3703cf61407f39f07b0787210ab21c4018af94ec389a3542c9a0d3fbd7bc07	2026-11-27 11:44:20.261705+00	2026-11-20 12:09:48.554751+00	3b94f1b11260582f1aded5686ae67e734cefea6073154a9e76ff7af5d5dabcc2	2026-11-20 11:44:20.261711+00	::1
09aed672-af4d-4332-b838-7f950ad2b373	ca98b73a-0982-4a3c-9834-a7df0fd609d3	3b94f1b11260582f1aded5686ae67e734cefea6073154a9e76ff7af5d5dabcc2	2026-11-27 12:09:48.561008+00	2026-11-20 12:11:28.54455+00	\N	2026-11-20 12:09:48.561014+00	::1
\.


--
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
20260930112628_InitialCreate	8.0.0
20261003110543_SyncRecipeDomainModel	8.0.0
20261109091033_AddBookmarksAndViewCount	10.0.0
20261115075520_AddNewsletterSubscribers	10.0.0
\.


--
-- Name: aggregatedcounter_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.aggregatedcounter_id_seq', 571, true);


--
-- Name: counter_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.counter_id_seq', 592, true);


--
-- Name: hash_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.hash_id_seq', 27, true);


--
-- Name: job_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.job_id_seq', 216, true);


--
-- Name: jobparameter_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.jobparameter_id_seq', 736, true);


--
-- Name: jobqueue_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.jobqueue_id_seq', 226, true);


--
-- Name: list_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.list_id_seq', 1, false);


--
-- Name: set_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.set_id_seq', 224, true);


--
-- Name: state_id_seq; Type: SEQUENCE SET; Schema: hangfire; Owner: postgres
--

SELECT pg_catalog.setval('hangfire.state_id_seq', 622, true);


--
-- Name: AspNetRoleClaims_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AspNetRoleClaims_Id_seq"', 1, false);


--
-- Name: AspNetUserClaims_Id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AspNetUserClaims_Id_seq"', 1, false);


--
-- Name: aggregatedcounter aggregatedcounter_key_key; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.aggregatedcounter
    ADD CONSTRAINT aggregatedcounter_key_key UNIQUE (key);


--
-- Name: aggregatedcounter aggregatedcounter_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.aggregatedcounter
    ADD CONSTRAINT aggregatedcounter_pkey PRIMARY KEY (id);


--
-- Name: counter counter_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.counter
    ADD CONSTRAINT counter_pkey PRIMARY KEY (id);


--
-- Name: hash hash_key_field_key; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.hash
    ADD CONSTRAINT hash_key_field_key UNIQUE (key, field);


--
-- Name: hash hash_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.hash
    ADD CONSTRAINT hash_pkey PRIMARY KEY (id);


--
-- Name: job job_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.job
    ADD CONSTRAINT job_pkey PRIMARY KEY (id);


--
-- Name: jobparameter jobparameter_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.jobparameter
    ADD CONSTRAINT jobparameter_pkey PRIMARY KEY (id);


--
-- Name: jobqueue jobqueue_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.jobqueue
    ADD CONSTRAINT jobqueue_pkey PRIMARY KEY (id);


--
-- Name: list list_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.list
    ADD CONSTRAINT list_pkey PRIMARY KEY (id);


--
-- Name: lock lock_resource_key; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.lock
    ADD CONSTRAINT lock_resource_key UNIQUE (resource);

ALTER TABLE ONLY hangfire.lock REPLICA IDENTITY USING INDEX lock_resource_key;


--
-- Name: schema schema_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.schema
    ADD CONSTRAINT schema_pkey PRIMARY KEY (version);


--
-- Name: server server_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.server
    ADD CONSTRAINT server_pkey PRIMARY KEY (id);


--
-- Name: set set_key_value_key; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.set
    ADD CONSTRAINT set_key_value_key UNIQUE (key, value);


--
-- Name: set set_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.set
    ADD CONSTRAINT set_pkey PRIMARY KEY (id);


--
-- Name: state state_pkey; Type: CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.state
    ADD CONSTRAINT state_pkey PRIMARY KEY (id);


--
-- Name: AspNetRoleClaims PK_AspNetRoleClaims; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetRoleClaims"
    ADD CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY ("Id");


--
-- Name: AspNetRoles PK_AspNetRoles; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetRoles"
    ADD CONSTRAINT "PK_AspNetRoles" PRIMARY KEY ("Id");


--
-- Name: AspNetUserClaims PK_AspNetUserClaims; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserClaims"
    ADD CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY ("Id");


--
-- Name: AspNetUserLogins PK_AspNetUserLogins; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserLogins"
    ADD CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY ("LoginProvider", "ProviderKey");


--
-- Name: AspNetUserRoles PK_AspNetUserRoles; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY ("UserId", "RoleId");


--
-- Name: AspNetUserTokens PK_AspNetUserTokens; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserTokens"
    ADD CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY ("UserId", "LoginProvider", "Name");


--
-- Name: AspNetUsers PK_AspNetUsers; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUsers"
    ADD CONSTRAINT "PK_AspNetUsers" PRIMARY KEY ("Id");


--
-- Name: Categories PK_Categories; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "PK_Categories" PRIMARY KEY ("Id");


--
-- Name: NewsletterSubscribers PK_NewsletterSubscribers; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NewsletterSubscribers"
    ADD CONSTRAINT "PK_NewsletterSubscribers" PRIMARY KEY ("Id");


--
-- Name: RecipeBookmarks PK_RecipeBookmarks; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecipeBookmarks"
    ADD CONSTRAINT "PK_RecipeBookmarks" PRIMARY KEY ("Id");


--
-- Name: RecipeImages PK_RecipeImages; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecipeImages"
    ADD CONSTRAINT "PK_RecipeImages" PRIMARY KEY ("Id");


--
-- Name: RecipeIngredients PK_RecipeIngredients; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecipeIngredients"
    ADD CONSTRAINT "PK_RecipeIngredients" PRIMARY KEY ("Id");


--
-- Name: RecipeSteps PK_RecipeSteps; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecipeSteps"
    ADD CONSTRAINT "PK_RecipeSteps" PRIMARY KEY ("Id");


--
-- Name: Recipes PK_Recipes; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipes"
    ADD CONSTRAINT "PK_Recipes" PRIMARY KEY ("Id");


--
-- Name: RefreshTokens PK_RefreshTokens; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshTokens"
    ADD CONSTRAINT "PK_RefreshTokens" PRIMARY KEY ("Id");


--
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- Name: ix_hangfire_counter_expireat; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_counter_expireat ON hangfire.counter USING btree (expireat);


--
-- Name: ix_hangfire_counter_key; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_counter_key ON hangfire.counter USING btree (key);


--
-- Name: ix_hangfire_hash_expireat; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_hash_expireat ON hangfire.hash USING btree (expireat);


--
-- Name: ix_hangfire_job_expireat; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_job_expireat ON hangfire.job USING btree (expireat);


--
-- Name: ix_hangfire_job_statename; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_job_statename ON hangfire.job USING btree (statename);


--
-- Name: ix_hangfire_job_statename_is_not_null; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_job_statename_is_not_null ON hangfire.job USING btree (statename) INCLUDE (id) WHERE (statename IS NOT NULL);


--
-- Name: ix_hangfire_jobparameter_jobidandname; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_jobparameter_jobidandname ON hangfire.jobparameter USING btree (jobid, name);


--
-- Name: ix_hangfire_jobqueue_fetchedat_queue_jobid; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_jobqueue_fetchedat_queue_jobid ON hangfire.jobqueue USING btree (fetchedat NULLS FIRST, queue, jobid);


--
-- Name: ix_hangfire_jobqueue_jobidandqueue; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_jobqueue_jobidandqueue ON hangfire.jobqueue USING btree (jobid, queue);


--
-- Name: ix_hangfire_jobqueue_queueandfetchedat; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_jobqueue_queueandfetchedat ON hangfire.jobqueue USING btree (queue, fetchedat);


--
-- Name: ix_hangfire_list_expireat; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_list_expireat ON hangfire.list USING btree (expireat);


--
-- Name: ix_hangfire_set_expireat; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_set_expireat ON hangfire.set USING btree (expireat);


--
-- Name: ix_hangfire_set_key_score; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_set_key_score ON hangfire.set USING btree (key, score);


--
-- Name: ix_hangfire_state_jobid; Type: INDEX; Schema: hangfire; Owner: postgres
--

CREATE INDEX ix_hangfire_state_jobid ON hangfire.state USING btree (jobid);


--
-- Name: EmailIndex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EmailIndex" ON public."AspNetUsers" USING btree ("NormalizedEmail");


--
-- Name: IX_AspNetRoleClaims_RoleId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON public."AspNetRoleClaims" USING btree ("RoleId");


--
-- Name: IX_AspNetUserClaims_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AspNetUserClaims_UserId" ON public."AspNetUserClaims" USING btree ("UserId");


--
-- Name: IX_AspNetUserLogins_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AspNetUserLogins_UserId" ON public."AspNetUserLogins" USING btree ("UserId");


--
-- Name: IX_AspNetUserRoles_RoleId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_AspNetUserRoles_RoleId" ON public."AspNetUserRoles" USING btree ("RoleId");


--
-- Name: IX_NewsletterSubscribers_NormalizedEmail; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_NewsletterSubscribers_NormalizedEmail" ON public."NewsletterSubscribers" USING btree ("NormalizedEmail");


--
-- Name: IX_NewsletterSubscribers_UnsubscribeToken; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_NewsletterSubscribers_UnsubscribeToken" ON public."NewsletterSubscribers" USING btree ("UnsubscribeToken");


--
-- Name: IX_RecipeBookmarks_RecipeId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_RecipeBookmarks_RecipeId" ON public."RecipeBookmarks" USING btree ("RecipeId");


--
-- Name: IX_RecipeBookmarks_UserId_RecipeId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_RecipeBookmarks_UserId_RecipeId" ON public."RecipeBookmarks" USING btree ("UserId", "RecipeId");


--
-- Name: IX_RecipeImages_RecipeId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_RecipeImages_RecipeId" ON public."RecipeImages" USING btree ("RecipeId");


--
-- Name: IX_RecipeIngredients_RecipeId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_RecipeIngredients_RecipeId" ON public."RecipeIngredients" USING btree ("RecipeId");


--
-- Name: IX_RecipeSteps_RecipeId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_RecipeSteps_RecipeId" ON public."RecipeSteps" USING btree ("RecipeId");


--
-- Name: IX_Recipes_AuthorId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Recipes_AuthorId" ON public."Recipes" USING btree ("AuthorId");


--
-- Name: IX_Recipes_CategoryId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_Recipes_CategoryId" ON public."Recipes" USING btree ("CategoryId");


--
-- Name: IX_Recipes_Slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IX_Recipes_Slug" ON public."Recipes" USING btree ("Slug");


--
-- Name: IX_RefreshTokens_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_RefreshTokens_UserId" ON public."RefreshTokens" USING btree ("UserId");


--
-- Name: RoleNameIndex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RoleNameIndex" ON public."AspNetRoles" USING btree ("NormalizedName");


--
-- Name: UserNameIndex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserNameIndex" ON public."AspNetUsers" USING btree ("NormalizedUserName");


--
-- Name: jobparameter jobparameter_jobid_fkey; Type: FK CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.jobparameter
    ADD CONSTRAINT jobparameter_jobid_fkey FOREIGN KEY (jobid) REFERENCES hangfire.job(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: state state_jobid_fkey; Type: FK CONSTRAINT; Schema: hangfire; Owner: postgres
--

ALTER TABLE ONLY hangfire.state
    ADD CONSTRAINT state_jobid_fkey FOREIGN KEY (jobid) REFERENCES hangfire.job(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AspNetRoleClaims FK_AspNetRoleClaims_AspNetRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetRoleClaims"
    ADD CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AspNetRoles"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserClaims FK_AspNetUserClaims_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserClaims"
    ADD CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserLogins FK_AspNetUserLogins_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserLogins"
    ADD CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserRoles FK_AspNetUserRoles_AspNetRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AspNetRoles"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserRoles FK_AspNetUserRoles_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: AspNetUserTokens FK_AspNetUserTokens_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AspNetUserTokens"
    ADD CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: RecipeBookmarks FK_RecipeBookmarks_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecipeBookmarks"
    ADD CONSTRAINT "FK_RecipeBookmarks_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: RecipeBookmarks FK_RecipeBookmarks_Recipes_RecipeId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecipeBookmarks"
    ADD CONSTRAINT "FK_RecipeBookmarks_Recipes_RecipeId" FOREIGN KEY ("RecipeId") REFERENCES public."Recipes"("Id") ON DELETE CASCADE;


--
-- Name: RecipeImages FK_RecipeImages_Recipes_RecipeId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecipeImages"
    ADD CONSTRAINT "FK_RecipeImages_Recipes_RecipeId" FOREIGN KEY ("RecipeId") REFERENCES public."Recipes"("Id") ON DELETE CASCADE;


--
-- Name: RecipeIngredients FK_RecipeIngredients_Recipes_RecipeId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecipeIngredients"
    ADD CONSTRAINT "FK_RecipeIngredients_Recipes_RecipeId" FOREIGN KEY ("RecipeId") REFERENCES public."Recipes"("Id") ON DELETE CASCADE;


--
-- Name: RecipeSteps FK_RecipeSteps_Recipes_RecipeId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecipeSteps"
    ADD CONSTRAINT "FK_RecipeSteps_Recipes_RecipeId" FOREIGN KEY ("RecipeId") REFERENCES public."Recipes"("Id") ON DELETE CASCADE;


--
-- Name: Recipes FK_Recipes_AspNetUsers_AuthorId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipes"
    ADD CONSTRAINT "FK_Recipes_AspNetUsers_AuthorId" FOREIGN KEY ("AuthorId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- Name: Recipes FK_Recipes_Categories_CategoryId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipes"
    ADD CONSTRAINT "FK_Recipes_Categories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES public."Categories"("Id") ON DELETE RESTRICT;


--
-- Name: RefreshTokens FK_RefreshTokens_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshTokens"
    ADD CONSTRAINT "FK_RefreshTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict JhTmu3QvASF7ZqNmvIh8ktVmo5ClCUBhiHSqOVrhI2Xogwv0o90gycNKVwv9mPX

