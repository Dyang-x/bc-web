import React from 'react';
import TaskTranSport from '~/pages/TaskTransport/index';
import { TransportTaskType } from '~/enum/enum';

const Index = () => {

  return (
    <TaskTranSport taskKind={1}  taskType={TransportTaskType}/>
  );
};

export default Index;
