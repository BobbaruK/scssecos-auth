## Getting Started

1. Set the env file in the root of the project - there is a sample [here](./.env.sample)
2. Set the env file in the frontend app (webapp) - there is a sample [here](/webapp/.env.sample)

3. Run the server:

```bash
# dev
docker compose -f docker-compose.dev.yml up --watch
```

```bash
# prod multi stage
docker compose -f docker-compose.docker-compose.prod-without-multistage.yml up
```

```bash
# prod
docker compose -f docker-compose.docker-compose.prod.yml up
```

## Backup and restore postgres databeses in docker

```sh
# all dbs
docker exec -t your-db-container pg_dumpall -c -U db_user > dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql
```

```sh
# specific db
docker exec -t your_db_container pg_dump -U db_user db_name --clean > dump_db_name_`date +%Y-%m-%d"_"%H_%M_%S`.sql
```

### gzip

```sh
# all dbs
docker exec -t your-db-container pg_dumpall -c -U db_user | gzip > dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz
```

```sh
# specific db
docker exec -t your-db-container pg_dump -U db_user db_name | gzip > dump_db_name_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz
```

### brotli or bzip2

```sh
# all dbs
docker exec -t your-db-container pg_dumpall -c -U db_user | brotli --best > dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql.br
```

```sh
# specific db
docker exec -t your-db-container pg_dump -U db_user db_name | brotli > dump_db_name_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz
```

```sh
# all dbs
docker exec -t your-db-container pg_dumpall -c -U db_user | bzip2 --best > dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql.bz2
```

```sh
# specific db
docker exec -t your-db-container pg_dump -U db_user db_name | bzip2 > dump_db_name_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz
```

### Restore

```sh
# all dbs
cat your_dump.sql | docker exec -i your-db-container psql -U db_user
```

```sh
# specific db
cat your_dump.sql | docker exec -i your-db-container psql -U db_user -d db_name
```
