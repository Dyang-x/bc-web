import React from 'react';
import TaskTranSport from '~/pages/TaskTransport/index';
import { taskType } from '~/enum/enum';

const Index = () => {

  return (
    <TaskTranSport taskKind={2} taskType={taskType} />
  );
};

export default Index;
