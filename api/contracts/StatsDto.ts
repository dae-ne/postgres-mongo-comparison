import { StatsDatasetDto } from './StatsDatasetDto';

export interface StatsDto {
  method_name: string;
  labels: number[];
  datasets: StatsDatasetDto[];
}
