import { LeavesService } from './leaves.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
export declare class LeavesController {
    private readonly leavesService;
    constructor(leavesService: LeavesService);
    create(dto: CreateLeaveDto, req: any): Promise<import("./entities/leave.entity").Leave>;
    listAll(): Promise<import("./entities/leave.entity").Leave[]>;
    listByEmployee(id: string): Promise<import("./entities/leave.entity").Leave[]>;
    approve(id: string, body: any, req: any): Promise<import("./entities/leave.entity").Leave>;
}
