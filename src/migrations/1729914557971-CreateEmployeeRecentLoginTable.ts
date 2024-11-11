import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import logger from "../utils/logger";


export class CreateEmployeeRecentLoginTable1729914557971 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "employee_recent_logins",
                columns: [
                    {
                        name: "activity_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "employee_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "login_time",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "branch_id",
                        type: "int",
                        isNullable: false,
                    },
                ]
            }),
            true
        );
        logger.info(`Table created: employee_recent_logins`);

        await queryRunner.createForeignKey(
            "employee_recent_logins",
            new TableForeignKey({
                columnNames: ["employee_id"],
                referencedTableName: "employees",
                referencedColumnNames: ["employee_id"],
                onDelete: "CASCADE",
                name: "FK_employee_recent_login_employee_id"
            })
        );

        logger.info(`Foreign key created: FK_employee_recent_login_employee_id`);

        await queryRunner.createForeignKey(
            "employee_recent_logins",
            new TableForeignKey({
                columnNames: ["branch_id"],
                referencedTableName: "post_office",
                referencedColumnNames: ["branch_id"],
                onDelete: "CASCADE",
                name: "FK_employee_recent_login_branch_id",
                
            })
        );

        logger.info(`Foreign key created: FK_employee_recent_login_branch_id`);


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("employee_recent_logins", "FK_employee_recent_login_employee_id");
        logger.info(`Foreign key dropped: FK_employee_recent_login_employee_id`);

        await queryRunner.dropForeignKey("employee_recent_logins", "FK_employee_recent_login_branch_id");
        logger.info(`Foreign key dropped: FK_employee_recent_login_branch_id`);
        
        await queryRunner.dropTable("employee_recent_logins");
        logger.info(`Table dropped: employee_recent_logins`);
    }

}
