"""Tests for the content checks in tools/build.py.  Run:  python3 -m unittest discover tests"""
import copy
import json
import pathlib
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools'))
import build  # noqa: E402

REAL = {p.name: json.loads(p.read_text(encoding='utf-8')) for p in (ROOT / 'content').glob('*.json')}


def run_with(mutate):
    data = copy.deepcopy(REAL)
    mutate(data)
    original = build.load
    build.load = lambda name: data[name]
    try:
        errors, *_ = build.validate()
    finally:
        build.load = original
    return errors


class ContentChecks(unittest.TestCase):
    def test_real_content_passes(self):
        self.assertEqual(run_with(lambda d: None), [])

    def test_missing_swedish_fails(self):
        def m(d):
            d['structures.json']['structures'][0]['fields']['origin']['sv'] = ''
        errors = run_with(m)
        self.assertTrue(any('missing its Swedish text' in e for e in errors), errors)

    def test_missing_hungarian_in_question_fails(self):
        def m(d):
            del d['questions.json']['questions'][0]['explanation']['hu']
        self.assertTrue(any('Hungarian' in e for e in run_with(m)))

    def test_broken_question_link_fails(self):
        def m(d):
            d['questions.json']['questions'][0]['link']['item'] = 'm.does-not-exist'
        self.assertTrue(any('does not exist' in e for e in run_with(m)))

    def test_wrong_option_needs_explanation(self):
        def m(d):
            q = next(q for q in d['questions.json']['questions'] if q['type'] == 'mc')
            wrong = 1 if q['answer'] == 0 else 0
            q['options'][wrong]['whyWrong'] = None
        self.assertTrue(any('whyWrong' in e for e in run_with(m)))

    def test_reviewed_needs_reviewer_and_date(self):
        def m(d):
            d['terms.json']['terms'][0]['review'] = {'status': 'reviewed', 'by': None, 'date': None}
        self.assertTrue(any('review.by' in e for e in run_with(m)))

    def test_duplicate_ids_fail(self):
        def m(d):
            t = d['terms.json']['terms']
            t[1]['id'] = t[0]['id']
        self.assertTrue(any('duplicate id' in e for e in run_with(m)))

    def test_semester_credits_must_add_up(self):
        def m(d):
            d['ki-programme.json']['courses'][0]['credits'] += 1
        self.assertTrue(any('semester 1' in e for e in run_with(m)))


if __name__ == '__main__':
    unittest.main()
