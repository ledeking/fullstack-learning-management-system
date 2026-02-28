"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import type { Lesson } from "@prisma/client";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type LessonPlayerProps = {
  lesson: Lesson;
};

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const [playing, setPlaying] = useState(false);

  if (lesson.type === "VIDEO" && lesson.videoUrl) {
    return (
      <div className="aspect-video w-full">
        <ReactPlayer
          url={lesson.videoUrl}
          width="100%"
          height="100%"
          controls
          playing={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </div>
    );
  }

  return (
    <Card className="p-8 text-center">
      <p className="text-muted-foreground">No video content available</p>
    </Card>
  );
}
