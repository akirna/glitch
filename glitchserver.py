'''
Maria Cioffi, Cole Conte, Andrew Kirna
glitchserver.py
Last Edited: Tue Dec 8 2015
Revised from a sample Python Server from Xiannong Meng,
which was in turn revised from the code segments:
http://stackoverflow.com/questions/23264569/python-3-x-basehttpserver-or-http-server
and
https://wiki.python.org/moin/BaseHttpServer#Official_Documentation
'''

from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib
import requests
import time
import os
import stat
from os.path import isfile, join
import operator

HOST_NAME = "brki164-lnx-10"  # any real host name where the server is running
HOST_PORT = 9000
server_name = "Python Server"
imgVidAudExtensions=[".png",".jpeg",".jpg",".tiff",".gif",".bmp",".svg",".mp4",\
                        ".flv",".ogg",".gifv",".mov",".qt",".wmv",".m4p",".m4v",\
                        ".mpg",".mp2",".mpeg",".mp3",".wav",".wma",".m4a"]

class MyServer(BaseHTTPRequestHandler):
    '''handles GET and POST requests from Google Chrome extension Glitch'''
    def do_HEAD(self):
        '''sends headers'''
        self.send_response(200)
        self.send_header("Server", server_name)
        self.send_header("Content-Type", "text")
        self.send_header("Access-Control-Allow-Origin","*")
        self.end_headers()
    
    def do_GET(self):
        '''handles GET requests to the server'''
        fileList=self.getFiveMostRecentFiles()
        self.do_HEAD()
        self.wfile.write(("file").encode("utf-8"))
        for x in fileList:
                self.wfile.write((x[0]).encode("utf-8"))
                self.wfile.write(("\n").encode("utf-8"))
                
    def isUserReadable(self,fName):
        '''tells us if a file is user readable'''
        stats = os.stat(fName)
        return bool(stats.st_mode & stat.S_IRUSR)

    def isUserWritable(self,fName):
        '''tells us if a file is user writable'''
        stats = os.stat(fName)
        return bool(stats.st_mode & stat.S_IWUSR)
    
    def getFiveMostRecentFiles(self):
        '''returns a list of the five most recently edited files in the current directory.
        does not return media files, backup files, and the server itself.'''
        mypath=os.getcwd()
        fileList=self.getFiles(mypath)
        newFList = [x for x in fileList if isfile(x)]
        info={} #holds key-value pairs of file and time last edited
        for x in newFList:
            if self.isUserReadable(x) and self.isUserWritable(x):
                fd = os.open(x, os.O_RDWR|os.O_CREAT )
                fName=x.replace(str(mypath)+"/",'')
                fileInfo= os.fstat(fd)
                os.close(fd)
                info[fName]=fileInfo[8]
        sortedFiles = sorted(info.items(), key=operator.itemgetter(1),reverse=True)
        fileList = []
        for x in sortedFiles:
            #prevents writing into backup files, the server,and media files
            if("~" != x[0][-1] and x[0] != "glitchserver.py" and x[0][-4:] not in imgVidAudExtensions):
                fileList +=[x]
        if len(fileList)>5:
            fileList=fileList[:5]
        return fileList

    def getFiles(self,path):
        '''gets all files from the filesystem'''
        fileList=[]
        fList=[f for f in os.listdir(path) if not f[0] == '.']
        fList2=[]
        for f in fList:
            if os.path.isdir(f):
                if os.listdir(f) != []: #eliminates empty directories
                    fList2+=[f]
            else:
                fList2+=[f]
        if len(fList2)>0:
            for d in fList2:
                abs_d = os.path.join(path, d)
                if os.path.isdir(abs_d) and abs_d[0]!=".":
                    fileList+=self.getFiles(abs_d)
                if os.path.isfile(abs_d) and abs_d[0]!=" ":
                    fileList+=[abs_d]
            for x in fileList:
                return fileList
        else:
            return []
        

    def do_POST(self):
        '''handles POST requests to the server'''
        length = int(self.headers['Content-Length'])
        post_data = urllib.parse.parse_qs(self.rfile.read(length).decode('utf-8'))
        # You now have a dictionary of the post data
        for k in post_data:
            if post_data[k][0] == "!--GETNOTES": #sends back file contents if requested
                f=open(k)
                g=f.read()
                self.do_HEAD()
                self.wfile.write(("text"+g).encode("utf-8"))
                f.close()
            elif post_data[k][0][:12]=="!--OVERWRITE": #writes edits from View Notes tab to file
                self.overwriteFile(k,post_data[k][0][12:])
            elif post_data[k][0][-4:] in imgVidAudExtensions or post_data[k][0][-5:] in imgVidAudExtensions: #handles media files
                self.downloadMediaFile(post_data[k][0])
            else: #handles text
                self.saveTextToFile(k,post_data[k][0])

    def downloadMediaFile(self,url):
        '''downloads a media file to the current directory.
        the media file will be named what is named on the web
        (the back end of its URL)'''
        #gets the name of the file
        fileName=""
        i=-1
        while(url[i]!="/"):
            fileName+=url[i]
            i-=1
        #reverse fileName
        fileName=fileName[::-1]
        #if the name already exists, add a number to the end
        if(os.path.isfile(fileName)):
            num=1
            fileName=fileName[:-4]+str(num)+fileName[-4:]
        while(os.path.isfile(fileName)):
            num+=1
            fileName=fileName[:-5]+str(num)+fileName[-4:]
        r = requests.get(url, stream=True)
        with open(fileName, 'wb') as f: #downloads the file
            print("Downloading...")
            for chunk in r.iter_content(chunk_size=1024): 
                if chunk:
                    f.write(chunk)
            print("Complete")
            print("Downloaded new media file into " + fileName)

    def saveTextToFile(self,file,text):
        '''writes text to a file. Existing files will be appended to.'''
        exists = os.path.isfile(file)
        if exists:
            f=open(str(file),"a")
        else:
            f=open(str(file),"w")
        f.write(str(text))
        f.close()
        if exists:
            print("Appended to existing file " + file)
        else:
            print("Wrote to new file " + file)

    def overwriteFile(self,file,text):
        '''overwrites previously existing file with contents of View Notes tab'''
        f=open(str(file),"w")
        f.write(str(text))
        f.close()
        f=open(str(file),"r")
        g=f.read()
        self.do_HEAD()
        self.wfile.write(("text"+g).encode("utf-8"))
        print("Overwrote file " + file)
            
if __name__ == '__main__':

    httpd = HTTPServer((HOST_NAME, HOST_PORT), MyServer)
    print(time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, HOST_PORT))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()
        print()
        print(time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, HOST_PORT))
