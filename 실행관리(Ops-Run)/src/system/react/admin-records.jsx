export function validateRecords(records) {
  if (!Array.isArray(records)) throw new Error('자료 목록은 배열이어야 합니다.');
  const ids = new Set();
  for (const record of records) {
    if (!record || typeof record.id !== 'string' || !record.id || ids.has(record.id) || typeof record.title !== 'string' || typeof record.status !== 'string') throw new Error('자료의 고유 ID·제목·상태를 확인해 주세요.');
    ids.add(record.id);
  }
  return records;
}
export function savedRecord(result, draft, statuses) {
  const saved = result === undefined ? draft : result;
  if (!saved || saved.id !== draft.id || typeof saved.title !== 'string' || !saved.title.trim() || !statuses.some(s => s.value === saved.status)) throw new Error('저장 응답을 확인할 수 없습니다. 다시 시도해 주세요.');
  return { ...draft, ...saved };
}
