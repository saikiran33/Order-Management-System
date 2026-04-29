import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    getByClient(clientId: string): Promise<import("./entities/project.entity").Project[]>;
    create(clientId: string, body: any): Promise<import("./entities/project.entity").Project[]>;
}
