import * as React from 'react';
import { useGetAnalyticsBoardTimepoints } from 'hooks/Network/Analytics';
import { getHoursAgo } from 'utils/dateFormatting';

export type UseLiveViewProps = {
  boardId: string;
};

export type UseLiveViewReturn = {
  time: { start: Date; end: Date };
  onChangeTime: (newTime: { start: Date; end: Date }) => void;
  onClearTime: () => void;
  getTimepoints: ReturnType<typeof useGetAnalyticsBoardTimepoints>;
};

export const useLiveView = ({ boardId }: UseLiveViewProps) => {
  const [time, setTime] = React.useState({
    start: getHoursAgo(5),
    end: new Date(),
  });

  const onChangeTime = (newTime: { start: Date; end: Date }) => setTime({ ...newTime });
  const onClearTime = () => {
    setTime({
      start: getHoursAgo(5),
      end: new Date(),
    });
  };

  const getTimepoints = useGetAnalyticsBoardTimepoints({ id: boardId, startTime: time.start, endTime: time.end });

  return React.useMemo(
    () =>
      ({
        time,
        onChangeTime,
        onClearTime,
        getTimepoints,
      } as UseLiveViewReturn),
    [getTimepoints, time],
  );
};
