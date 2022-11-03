export interface IReporter {
  id: string;
  name: string;
  value: number;
}

const reporter = ({ id, name, value }: IReporter): void => {
  ga('send', 'event', {
    eventAction: name,
    eventCategory: 'Web Vitals',
    eventLabel: id,
    eventValue: Math.round(name === 'CLS' ? value * 1000 : value),
    nonInteraction: true,
  });
};

export default reporter;
