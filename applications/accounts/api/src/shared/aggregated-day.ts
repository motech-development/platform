const aggregatedDay = (date: string): string => {
  const MS_IN_DAY = 1000 * 60 * 60 * 24;
  const recordDate = new Date(date);
  const aggregate = recordDate.getTime() - (recordDate.getTime() % MS_IN_DAY);
  const result = new Date(aggregate);

  return result.toISOString();
};

export default aggregatedDay;
