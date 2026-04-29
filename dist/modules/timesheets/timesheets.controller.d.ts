import { TimesheetsService } from './timesheets.service';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
export declare class TimesheetsController {
    private readonly svc;
    constructor(svc: TimesheetsService);
    create(dto: CreateTimesheetDto, req: any): Promise<import("./entities/timesheet.entity").Timesheet>;
    myTimesheets(req: any): Promise<import("./entities/timesheet.entity").Timesheet[]>;
    listAll(): Promise<import("./entities/timesheet.entity").Timesheet[]>;
    approve(id: string, body: any, req: any): Promise<import("./entities/timesheet.entity").Timesheet>;
}
