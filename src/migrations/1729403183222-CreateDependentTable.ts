import { MigrationInterface, QueryRunner, TableForeignKey, Table } from "typeorm";
import logger from '../utils/logger';


export class CreateDependentTable1729403183222 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "dependent",
                columns: [
                    {
                        name: "dependent_id",
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
                        name: "first_name",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                    },
                    {
                        name: "last_name",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                    },
                    {
                        name: "relationship",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                    },
                    {
                        name: "date_of_birth",
                        type: "DATE",
                        isNullable: false,
                    },
                    {
                        name: "sex",
                        type: "char",
                        length: "1",
                        isNullable: true,
                    }
                ],
            }),
            true
        );

        logger.info(`Table created: dependent`);

        await queryRunner.createForeignKey(
            "dependent",
            new TableForeignKey({
                columnNames: ["employee_id"],
                referencedTableName: "employees",
                referencedColumnNames: ["employee_id"],
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
                name: "FK_dependent_employee_id",
            })
        );
        logger.info(`Foreign key created: FK_dependent_employee_id`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("dependent", "FK_dependent_employee_id");
        logger.info(`Foreign key dropped: FK_dependent_employee_id`);

        await queryRunner.dropTable("dependent");
        logger.info(`Table dropped: dependent`);
    }

}
