export interface PaginatedDto {
  count: number;
  page: number;
  total: number;
  data: unknown;
}

export interface StatsDatasetDto {
  name: string;
  times: number[];
}

export interface StatsDto {
  method_name: string;
  labels: number[];
  datasets: StatsDatasetDto[];
}
