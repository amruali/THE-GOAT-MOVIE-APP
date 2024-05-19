docker compose up -d

docker exec -it my-postgres-db bash pg_restore -U postgres -W -d postgres -v /backup/backup_file.dump
