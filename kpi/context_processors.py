from django.conf import settings

def dev_mode(request):
    out = {}
    out['livereload_script']  = settings.LIVERELOAD_SCRIPT
    out['use_minified_script'] = settings.USE_MINIFIED_SCRIPTS
    if settings.TRACKJS_TOKEN:
        out['trackjs_token'] = settings.TRACKJS_TOKEN
    return out

def linked_services(request):
    return {
        u'kobocat_url': settings.KOBOCAT_URL,
        u'enketo_url': settings.ENKETO_SERVER,
    }
