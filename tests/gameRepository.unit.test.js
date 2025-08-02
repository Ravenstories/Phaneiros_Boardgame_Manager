import { jest } from '@jest/globals';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

// Capture RPC calls
const rpcMock = jest.fn(async () => ({ data: [{ game_id: '1' }], error: null }));

// Mock supabase client used by the repository
jest.unstable_mockModule('@supabase/supabase-js', () => ({
  createClient: () => ({
    rpc: rpcMock,
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
    })),
  }),
}));

const repo = await import('../backend/repositories/gameRepository.js');

describe('gameRepository.createGame', () => {
  it('passes game type and name to SQL query', async () => {
    await repo.createGame('foo', 'Bar');
    expect(rpcMock).toHaveBeenCalledTimes(1);
    const [fn, args] = rpcMock.mock.calls[0];
    expect(fn).toBe('exec_sql');
    expect(args.params).toEqual({ game_type: 'foo', game_name: 'Bar' });
    expect(args.sql_text).toMatch(/game_type,\s*game_name/i);
    expect(args.sql_text).toMatch(/:game_type/);
    expect(args.sql_text).toMatch(/:game_name/);
  });
});