import React from "react";
import { useParams } from "react-router-dom";
import ProjectInfo from "@/components/project/ProjectInfo";
import IncidentsSection from "@/components/project/IncidentsSection";
import MilestonesSection from "@/components/project/MilestonesSection";
import ProgressSection from "@/components/project/ProgressSection";
import ProjectFilesSection from "@/components/project/ProjectFilesSection";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface ProjectDetailsPageProps {
  projectId?: number; // optional, will be read from URL if not passed
}

const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({ projectId }) => {
  const params = useParams<{ projectId: string }>();
  const id = projectId ?? Number(params.projectId);

  if (!id) return <p>Project ID not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Project Details</h1>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <ProjectInfo projectId={id} />
        </TabsContent>

        <TabsContent value="milestones">
          <MilestonesSection projectId={id} />
        </TabsContent>

        <TabsContent value="progress">
          <ProgressSection projectId={id} />
        </TabsContent>

        <TabsContent value="incidents">
          <IncidentsSection projectId={id} />
        </TabsContent>

        <TabsContent value="files">
          <ProjectFilesSection projectId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetailsPage;
