import { SpocsService } from './spocs.service';
import { CreateSpocDto } from './dto/create-spoc.dto';
export declare class SpocsController {
    private readonly spocsService;
    constructor(spocsService: SpocsService);
    getByClient(clientId: string): Promise<import("./entities/spoc.entity").Spoc[]>;
    create(clientId: string, body: CreateSpocDto): Promise<import("./entities/spoc.entity").Spoc[]>;
}
