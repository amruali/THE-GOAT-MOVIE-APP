docker compose up -d

sleep 5

docker exec -it -e PGPASSWORD=123456 my-postgres-db pg_restore -U postgres -d postgres -v /backup/backup_file.dump
