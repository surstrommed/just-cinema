export interface ILoader {
  isLoading: boolean;
}

export interface IMiniLoader {
  style?: {
    [key: string]: string;
  };
  time?: number;
  afterload?: React.ReactNode;
  cell?: boolean;
}
