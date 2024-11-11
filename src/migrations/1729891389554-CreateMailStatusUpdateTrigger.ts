import { MigrationInterface, QueryRunner } from "typeorm";
import logger from "../utils/logger";

export class CreateMailStatusUpdateTrigger1729891389554 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TRIGGER mail_status_update_trigger
            AFTER UPDATE ON packages
            FOR EACH ROW
            BEGIN
                INSERT INTO tracking_history (package_id, status, updated_at, location)
                VALUES (
                NEW.package_id, 
                NEW.status, NOW(), 
                CONCAT(
                    (SELECT city FROM address WHERE address_id = (SELECT post_office_address_id FROM post_office WHERE branch_id = NEW.branch_id)),
                    ', ',
                    (SELECT state FROM address WHERE address_id = (SELECT post_office_address_id FROM post_office WHERE branch_id = NEW.branch_id))
                )
                );
            END;
        `);
        logger.info(`Trigger created: mail_status_updated_trigger`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS mail_status_update_trigger;
        `);

        logger.info(`Trigger dropped: mail_status_update_trigger`);
    }

}
