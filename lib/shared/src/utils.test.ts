import { describe, expect, it } from 'vitest'

import {
    convertGitCloneURLToCodebaseName,
    convertGitCloneURLToCodebaseNameOrError,
    isError,
} from './utils'

describe('convertGitCloneURLToCodebaseName', () => {
    it('fails to converts repo names that are not valid URLs', () => {
        expect(convertGitCloneURLToCodebaseName('github.com/foo/bar')).toEqual(null)
        expect(convertGitCloneURLToCodebaseName('example.com/foo')).toEqual(null)
        expect(convertGitCloneURLToCodebaseName('gitlab.com/foo/bar/baz')).toEqual(null)
    })

    it('converts Azure DevOps URL', () => {
        expect(
            convertGitCloneURLToCodebaseName(
                'https://dev.azure.com/organization/project/_git/repository'
            )
        ).toEqual('dev.azure.com/organization/project/repository')
    })

    it('converts GitHub SSH URL', () => {
        expect(convertGitCloneURLToCodebaseName('git@github.com:sourcegraph/sourcegraph.git')).toEqual(
            'github.com/sourcegraph/sourcegraph'
        )
    })

    it('converts GitHub SSH URL with different user', () => {
        expect(
            convertGitCloneURLToCodebaseName('jdsbcnuqwew@github.com:sourcegraph/sourcegraph.git')
        ).toEqual('github.com/sourcegraph/sourcegraph')
    })

    it('converts GitHub SSH URL with the port number', () => {
        expect(
            convertGitCloneURLToCodebaseName('ssh://git@gitlab-my-company.net:20022/path/repo.git')
        ).toEqual('gitlab-my-company.net/path/repo')
    })

    it('converts GitHub SSH URL no trailing .git', () => {
        expect(convertGitCloneURLToCodebaseName('git@github.com:sourcegraph/sourcegraph')).toEqual(
            'github.com/sourcegraph/sourcegraph'
        )
    })

    it('converts GitHub HTTPS URL', () => {
        expect(convertGitCloneURLToCodebaseName('https://github.com/sourcegraph/sourcegraph')).toEqual(
            'github.com/sourcegraph/sourcegraph'
        )
    })

    it('converts Bitbucket HTTPS URL', () => {
        expect(
            convertGitCloneURLToCodebaseName(
                'https://username@bitbucket.org/sourcegraph/sourcegraph.git'
            )
        ).toEqual('bitbucket.org/sourcegraph/sourcegraph')
    })

    it('converts Bitbucket SSH URL', () => {
        expect(
            convertGitCloneURLToCodebaseName('git@bitbucket.sgdev.org:sourcegraph/sourcegraph.git')
        ).toEqual('bitbucket.sgdev.org/sourcegraph/sourcegraph')
    })

    it('converts GitLab SSH URL', () => {
        expect(convertGitCloneURLToCodebaseName('git@gitlab.com:sourcegraph/sourcegraph.git')).toEqual(
            'gitlab.com/sourcegraph/sourcegraph'
        )
    })

    it('converts GitLab HTTPS URL', () => {
        expect(
            convertGitCloneURLToCodebaseName('https://gitlab.com/sourcegraph/sourcegraph.git')
        ).toEqual('gitlab.com/sourcegraph/sourcegraph')
    })

    it('converts Gitlab SSH URL with Git and subgroups', () => {
        expect(
            convertGitCloneURLToCodebaseName('git@gitlab.com:sourcegraph/ui/sourcegraph-frontend.git')
        ).toEqual('gitlab.com/sourcegraph/ui/sourcegraph-frontend')
    })

    it('converts Gitlab SSH URL with Git and multiple subgroups', () => {
        expect(
            convertGitCloneURLToCodebaseName(
                'git@gitlab.com:sourcegraph/ui/cody-ui/sourcegraph-frontend.git'
            )
        ).toEqual('gitlab.com/sourcegraph/ui/cody-ui/sourcegraph-frontend')
    })

    it('converts custom hosts with a mono-repo', () => {
        expect(
            convertGitCloneURLToCodebaseName('some-user@my-custom-host.com.internal:mono-repo')
        ).toEqual('my-custom-host.com.internal/mono-repo')
    })

    it('converts custom hosts with a port', () => {
        expect(
            convertGitCloneURLToCodebaseName('some-user@my-custom-host.com.internal:2022/owner/repo.git')
        ).toEqual('my-custom-host.com.internal:2022/owner/repo')
    })

    it('converts GitHub SSH URL with Git', () => {
        expect(convertGitCloneURLToCodebaseName('git@github.com:sourcegraph/sourcegraph.git')).toEqual(
            'github.com/sourcegraph/sourcegraph'
        )
    })

    it('converts Eriks SSH Alias URL', () => {
        expect(convertGitCloneURLToCodebaseName('github:sourcegraph/sourcegraph')).toEqual(
            'github.com/sourcegraph/sourcegraph'
        )
    })

    it('converts HTTP URL', () => {
        expect(convertGitCloneURLToCodebaseName('http://github.com/sourcegraph/sourcegraph')).toEqual(
            'github.com/sourcegraph/sourcegraph'
        )
    })

    it('returns null for invalid URL', () => {
        expect(isError(convertGitCloneURLToCodebaseNameOrError('invalid'))).toBe(true)
    })

    it('converts URLs with dots in the repo name', () => {
        expect(
            convertGitCloneURLToCodebaseName('git@github.com:philipp-spiess/philippspiess.com.git')
        ).toEqual('github.com/philipp-spiess/philippspiess.com')
    })
})
