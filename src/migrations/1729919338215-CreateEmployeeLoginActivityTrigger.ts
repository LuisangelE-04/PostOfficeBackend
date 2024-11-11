import { MigrationInterface, QueryRunner } from "typeorm";
import logger from "../utils/logger";

export class CreateEmployeeLoginActivityTrigger1729919338215 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TRIGGER record_employee_login_activity
            AFTER UPDATE ON employees
            FOR EACH ROW
            BEGIN
                IF NEW.last_login != OLD.last_login THEN
                    INSERT INTO employee_recent_logins (employee_id, login_time, branch_id)
                    VALUES (NEW.employee_id, NOW(), NEW.branch_id);
                END IF;
            END

        `)

        logger.info(`Trigger created: record_employee_login_activity`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS record_employee_login_activity;`);
        logger.info(`Trigger dropped: record_employee_login_activity`);
    }

}
