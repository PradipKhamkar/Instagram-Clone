import { Avatar, Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState } from "react";
import { useRef } from "react";
import StoryDialog from "../shared/StoryDialog";

const Story = ({ stories }) => {
  const openStoryDialog = useRef();

  const [selectedStory, setSelectedStory] = useState({});
  const handelOpenStoryDialog = (story) => {
    setSelectedStory(story);
    openStoryDialog?.current();
  };

  return (
    <>
      <StoryDialog openDialog={openStoryDialog} story={selectedStory} />
      {stories.map((story, index) => (
        <Stack
          alignItems="center"
          sx={{ cursor: "pointer" }}
          gap={0.3}
          key={index}
          onClick={() => handelOpenStoryDialog(story)}
        >
          <Avatar
            alt="story image"
            src={story?.image_url}
            sx={{ border: "1px solid tomato", width: 50, height: 50 }}
          />
          <Typography variant="body2">{story?.createdBy?.userName}</Typography>
        </Stack>
      ))}
    </>
  );
};

export default Story;
