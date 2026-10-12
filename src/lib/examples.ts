export const EXAMPLE_TEXT = `Limit  (cost=1245.67..1245.72 rows=20 width=48) (actual time=8.312..8.320 rows=20 loops=1)
  Buffers: shared hit=452 read=12
  ->  Sort  (cost=1245.67..1258.90 rows=5292 width=48) (actual time=8.310..8.314 rows=20 loops=1)
        Sort Key: p.criado_em DESC
        Sort Method: top-N heapsort  Memory: 28kB
        Buffers: shared hit=452 read=12
        ->  Hash Join  (cost=98.50..1120.30 rows=5292 width=48) (actual time=1.204..7.850 rows=5310 loops=1)
              Hash Cond: (p.cliente_id = c.id)
              Buffers: shared hit=452 read=12
              ->  Seq Scan on pedidos p  (cost=0.00..950.00 rows=5292 width=24) (actual time=0.020..5.100 rows=5310 loops=1)
                    Filter: ((status = 'pago'::text) AND (criado_em >= '2026-08-01'::date))
                    Rows Removed by Filter: 44690
                    Buffers: shared hit=400 read=10
              ->  Hash  (cost=75.00..75.00 rows=1800 width=32) (actual time=1.150..1.150 rows=1800 loops=1)
                    Buckets: 2048  Batches: 1  Memory Usage: 112kB
                    Buffers: shared hit=52 read=2
                    ->  Seq Scan on clientes c  (cost=0.00..75.00 rows=1800 width=32) (actual time=0.008..0.520 rows=1800 loops=1)
                          Buffers: shared hit=52 read=2
Planning Time: 0.312 ms
Execution Time: 8.401 ms`;

export const EXAMPLE_JSON = JSON.stringify(
  [
    {
      Plan: {
        'Node Type': 'Limit',
        'Startup Cost': 1245.67,
        'Total Cost': 1245.72,
        'Plan Rows': 20,
        'Plan Width': 48,
        'Actual Startup Time': 8.312,
        'Actual Total Time': 8.32,
        'Actual Rows': 20,
        'Actual Loops': 1,
        Plans: [
          {
            'Node Type': 'Sort',
            'Startup Cost': 1245.67,
            'Total Cost': 1258.9,
            'Plan Rows': 5292,
            'Plan Width': 48,
            'Actual Startup Time': 8.31,
            'Actual Total Time': 8.314,
            'Actual Rows': 20,
            'Actual Loops': 1,
            'Sort Key': ['p.criado_em DESC'],
            'Sort Method': 'top-N heapsort',
            'Sort Space Used': 28,
            'Sort Space Type': 'Memory',
            Plans: [
              {
                'Node Type': 'Hash Join',
                'Join Type': 'Inner',
                'Startup Cost': 98.5,
                'Total Cost': 1120.3,
                'Plan Rows': 5292,
                'Plan Width': 48,
                'Actual Startup Time': 1.204,
                'Actual Total Time': 7.85,
                'Actual Rows': 5310,
                'Actual Loops': 1,
                'Hash Cond': '(p.cliente_id = c.id)',
                Plans: [
                  {
                    'Node Type': 'Seq Scan',
                    'Relation Name': 'pedidos',
                    Alias: 'p',
                    'Startup Cost': 0.0,
                    'Total Cost': 950.0,
                    'Plan Rows': 5292,
                    'Plan Width': 24,
                    'Actual Startup Time': 0.02,
                    'Actual Total Time': 5.1,
                    'Actual Rows': 5310,
                    'Actual Loops': 1,
                    Filter: "((status = 'pago'::text) AND (criado_em >= '2026-08-01'::date))",
                    'Rows Removed by Filter': 44690,
                    'Shared Hit Blocks': 400,
                    'Shared Read Blocks': 10,
                  },
                  {
                    'Node Type': 'Hash',
                    'Startup Cost': 75.0,
                    'Total Cost': 75.0,
                    'Plan Rows': 1800,
                    'Plan Width': 32,
                    'Actual Startup Time': 1.15,
                    'Actual Total Time': 1.15,
                    'Actual Rows': 1800,
                    'Actual Loops': 1,
                    'Hash Buckets': 2048,
                    'Hash Batches': 1,
                    'Peak Memory Usage': 112,
                    'Shared Hit Blocks': 52,
                    'Shared Read Blocks': 2,
                    Plans: [
                      {
                        'Node Type': 'Seq Scan',
                        'Relation Name': 'clientes',
                        Alias: 'c',
                        'Startup Cost': 0.0,
                        'Total Cost': 75.0,
                        'Plan Rows': 1800,
                        'Plan Width': 32,
                        'Actual Startup Time': 0.008,
                        'Actual Total Time': 0.52,
                        'Actual Rows': 1800,
                        'Actual Loops': 1,
                        'Shared Hit Blocks': 52,
                        'Shared Read Blocks': 2,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      'Planning Time': 0.312,
      'Execution Time': 8.401,
    },
  ],
  null,
  2
);
