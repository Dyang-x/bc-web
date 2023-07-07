import React from 'react';
import TaskTranSport from '~/pages/TaskTransport/index';
import { taskType,TransportTaskType } from '~/enum/enum';

const Index = () => {

  return (
    <TaskTranSport taskKind={3} taskType={TransportTaskType} />
  );
};

export default Index;
