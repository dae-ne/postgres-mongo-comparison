export interface Quantity {
  name: string;
  count: number;
}

export interface TestData {
  id: number;
  first_col: string;
  second_col: string;
  third_col: string;
  fourth_col: string;
}

export type TestDataWithoutId = Omit<TestData, 'id'>;
