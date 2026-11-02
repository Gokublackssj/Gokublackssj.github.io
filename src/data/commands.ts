// How each project is installed, run and tested: the commands exactly as the
// project's own README gives them (Windows PowerShell), checked on 2026-10-29
// against README.md in each repository. They are code, so they are the same in
// both languages; each step's explanation lives in src/i18n under `runSteps`,
// one label per block here, in the same order.
//
// QuoteFlow: github.com/Gokublackssj/quoteflow, "Fresh install" and "Tests".
// LeadFlow: github.com/Gokublackssj/LeadFlow, "Instalación y ejecución" and "Pruebas".
// Book Data Extractor Pro: github.com/Gokublackssj/book-data-extractor-pro,
// "Instalación", "Uso" and "Pruebas".

export type ProjectId = "quoteflow" | "leadflow" | "bookExtractor";

export const runCommands: Record<ProjectId, string[]> = {
  quoteflow: [
    "Copy-Item .env.example .env",
    "docker volume inspect quoteflow_pgdata",
    "docker compose up -d",
    'cd backend\npy -3.14 -m venv .venv\n.\\.venv\\Scripts\\python -m pip install -e ".[dev]" -c constraints.txt',
    ".\\.venv\\Scripts\\alembic -x db=test upgrade head\n.\\.venv\\Scripts\\alembic current\n.\\.venv\\Scripts\\alembic upgrade head",
    ".\\.venv\\Scripts\\python -m app.cli create-admin\n.\\.venv\\Scripts\\uvicorn app.main:create_app --factory --host 127.0.0.1 --port 8000",
    "cd frontend\nnpm ci\nnpm run dev",
  ],
  leadflow: [
    "Copy-Item .env.example .env\nCopy-Item frontend/.env.example frontend/.env.local",
    "docker compose up -d postgres\ndocker compose ps",
    "cd backend\npy -3.14 -m venv .venv\n.\\.venv\\Scripts\\Activate.ps1\npip install -r requirements.txt\npython -m app.init_db\nuvicorn app.main:app --reload",
    "cd frontend\nnpm install\nnpm run dev",
  ],
  bookExtractor: [
    "py -3.13 -m venv .venv\n.\\.venv\\Scripts\\Activate.ps1\npython -m pip install -r requirements.txt\npython -m playwright install chromium",
    "python main.py --limit 50",
    "python main.py --profile my_site.json --limit 20",
  ],
};

export const testCommands: Record<ProjectId, string> = {
  quoteflow:
    "cd backend\n.\\.venv\\Scripts\\python -m pytest\n.\\.venv\\Scripts\\ruff check .\n.\\.venv\\Scripts\\ruff format --check .\n\ncd ..\\frontend\nnpm run lint\nnpm run build\nnpx tsc --noEmit\nnpm test",
  leadflow: "cd backend\npytest\nruff check .\n\ncd frontend\nnpx playwright install chromium\nnpm run test:e2e",
  bookExtractor: "python -m pip install -r requirements-dev.txt\npython -m pytest",
};
