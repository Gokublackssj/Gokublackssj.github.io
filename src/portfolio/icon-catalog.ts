import type {Lang} from "../i18n";
import python from "./assets/devicon/python.svg?url";
import typescript from "./assets/devicon/typescript.svg?url";
import react from "./assets/devicon/react.svg?url";
import astro from "./assets/devicon/astro.svg?url";
import fastapi from "./assets/devicon/fastapi.svg?url";
import postgresql from "./assets/devicon/postgresql.svg?url";
import git from "./assets/devicon/git.svg?url";
import sqlalchemy from "./assets/devicon/sqlalchemy.svg?url";
import nextjs from "./assets/devicon/nextjs.svg?url";
import pytest from "./assets/devicon/pytest.svg?url";
import nodejs from "./assets/devicon/nodejs.svg?url";
import eslint from "./assets/devicon/eslint.svg?url";
import playwright from "./assets/devicon/playwright.svg?url";
import githubactions from "./assets/devicon/githubactions.svg?url";
import github from "./assets/devicon/github.svg?url";
import migrations from "./assets/functional/migrations.svg?url";
import database from "./assets/functional/database.svg?url";
import shield from "./assets/functional/shield.svg?url";
import credentials from "./assets/functional/credentials.svg?url";
import spreadsheet from "./assets/functional/spreadsheet.svg?url";
import document from "./assets/functional/document.svg?url";
import containers from "./assets/functional/containers.svg?url";
import code_check from "./assets/functional/code-check.svg?url";

export type TechnologyMark={src:string;kind:"brand"|"functional";tone?:"dark";description?:{es:string;en:string}};
const brand=(src:string,tone?:"dark"):TechnologyMark=>({src,kind:"brand",tone});
const functional=(src:string,es:string,en:string):TechnologyMark=>({src,kind:"functional",description:{es,en}});
const marks:Record<string,TechnologyMark>={
  python:brand(python),typescript:brand(typescript),react:brand(react,"dark"),astro:brand(astro),fastapi:brand(fastapi),postgresql:brand(postgresql),git:brand(git),sqlalchemy:brand(sqlalchemy),
  "next.js":brand(nextjs),pytest:brand(pytest),"node:test":brand(nodejs),eslint:brand(eslint),playwright:brand(playwright),"github actions":brand(githubactions),github:brand(github),
  alembic:functional(migrations,"Migraciones de base de datos","Database migrations"),
  psycopg:functional(database,"Controlador de PostgreSQL","PostgreSQL driver"),
  argon2:functional(shield,"Protección de contraseñas","Password protection"),
  pyjwt:functional(credentials,"Tokens y autenticación","Tokens and authentication"),
  openpyxl:functional(spreadsheet,"Lectura y escritura de hojas de cálculo","Spreadsheet reading and writing"),
  pypdf:functional(document,"Lectura de documentos PDF","PDF document reading"),
  "docker compose":functional(containers,"Entornos con contenedores","Container environments"),
  ruff:functional(code_check,"Revisión y formato de código","Code checking and formatting"),
};
export function technologyMark(name:string){
  const key=name.trim().toLowerCase().replace(/\s+\d.*$/,"");
  return marks[key]??functional(code_check,"Herramienta de desarrollo","Development tool");
}
export function markTitle(name:string,lang:Lang){
  const mark=technologyMark(name);
  return mark.kind==="functional"?`${name} · ${mark.description![lang]} · ${lang==="es"?"símbolo funcional, no logotipo oficial":"functional symbol, not an official logo"}`:name;
}
