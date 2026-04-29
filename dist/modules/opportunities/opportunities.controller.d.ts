import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
export declare class OpportunitiesController {
    private readonly oppService;
    constructor(oppService: OpportunitiesService);
    list(): Promise<import("./entities/opportunity.entity").Opportunity[]>;
    summary(): Promise<{
        total: number;
        open: number;
        potentialHires: number;
    }>;
    getOne(id: string): Promise<import("./entities/opportunity.entity").Opportunity>;
    create(dto: CreateOpportunityDto): Promise<import("./entities/opportunity.entity").Opportunity[]>;
    update(id: string, dto: UpdateOpportunityDto): Promise<import("./entities/opportunity.entity").Opportunity>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
