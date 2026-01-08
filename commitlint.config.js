module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nova feature
        'fix', // Correção de bug
        'docs', // Documentação
        'style', // Formatação
        'refactor', // Refatoração
        'perf', // Performance
        'test', // Testes
        'chore', // Tarefas gerais
        'ci', // CI/CD
        'build', // Build
        'revert', // Reverter commit
      ],
    ],
  },
};
